import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PngToJpeg from "@/pages/tools/image-converter/png-jpeg.vue"
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { ref, onUnmounted } from "vue";

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock alert
global.alert = vi.fn();

describe('pngtoJpeg Component', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Component Rendering', () => {
    it('should render the component correctly', () => {
      wrapper = mount(PngToJpeg);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render file input with correct attributes', () => {
      wrapper = mount(PngToJpeg);
      const fileInput = wrapper.find('input[type="file"]');

      expect(fileInput.exists()).toBe(true);
      expect(fileInput.attributes('accept')).toBe('image/*');
    });

    it('should render canvas element with hidden class', () => {
      wrapper = mount(PngToJpeg);
      const canvas = wrapper.find('canvas');

      expect(canvas.exists()).toBe(true);
      expect(canvas.classes()).toContain('hidden');
    });

    it('should not show download button initially', () => {
      wrapper = mount(PngToJpeg);
      const downloadButton = wrapper.find('[download]');

      expect(downloadButton.exists()).toBe(false);
    });
  });

  describe('validateMessage function', () => {
    it('should call alert with the provided message', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      vm.validateMessage('Test message');

      expect(global.alert).toHaveBeenCalledWith('Test message');
    });
  });


  //! load the image tests

  describe('loadImage function', () => {
    it('should successfully load an image', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: '',
        naturalWidth: 100,
        naturalHeight: 100,
      };
      // at top of describe or in beforeEach
      vi.stubGlobal('Image', vi.fn().mockImplementation(function (this: any) {
        let _src = ""; //backing field
        const img: any = {
          src: '',
          naturalWidth: 100,
          naturalHeight: 100,
        };

        Object.defineProperty(img, 'src', {
          get() {
            return _src
          },
          set(val: string) {
            _src = val;
            // simulate immediate success (most common pattern)
            queueMicrotask(() => img.onload?.());
          }
        });

        return img;
      }));

      const loadPromise = vm.loadImage(mockFile);

      // Trigger onload
      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      const result = await loadPromise;

      expect(result.naturalWidth).toBe(100);
      expect(result.naturalHeight).toBe(100);
      expect(result.src).toBe('mock-object-url');

      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should reject when image fails to load', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: '',
      };

      vi.stubGlobal(
        'Image',
        vi.fn().mockImplementation(function () {
          let _src = '';

          const img: any = {
            naturalWidth: 100,
            naturalHeight: 100,
            onload: null,
            onerror: null,
          };

          Object.defineProperty(img, 'src', {
            get() {
              return _src;
            },
            set(val: string) {
              _src = val;

              // simulate async image load success
              queueMicrotask(() => {
                img.onerror?.();
              });
            },
          });

          return img;
        })
      );
      const loadPromise = vm.loadImage(mockFile);
      // Trigger onerror
      setTimeout(() => {
        if (mockImage.onerror) mockImage.onerror();
      }, 0);

      await expect(loadPromise).rejects.toThrow('failed to load the image properly\n');
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  //! convert canvas to jpeg image

  describe('convertCanvasToJpegImage function', () => {
    it('should successfully convert canvas to JPEG blob', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      const mockCanvas = {
        toBlob: vi.fn((callback) => callback(mockBlob)),
      } as any;

      const result = await vm.convertCanvasToJpegImage(mockCanvas);

      expect(result).toBe(mockBlob);
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.9
      );
    });

    it('should reject when blob conversion fails', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockCanvas = {
        toBlob: vi.fn((callback) => callback(null)),
      } as any;

      await expect(vm.convertCanvasToJpegImage(mockCanvas)).rejects.toThrow(
        'jpeg conversion failed\n'
      );
    });
  });

  describe('onFileUpload function', () => {
    it('should return early if no input element', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      vm.inputElement = null;
      await vm.onFileUpload();

      expect(global.alert).not.toHaveBeenCalled();
    });

    it('should return early if no file selected', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      vm.inputElement = { files: [] };
      await vm.onFileUpload();

      expect(global.alert).not.toHaveBeenCalled();
    });

    it('should validate that file is PNG', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      vm.inputElement = { files: [mockFile] };

      await vm.onFileUpload();

      expect(global.alert).toHaveBeenCalledWith('please select a valid png image\n');
    });

    it('should process valid PNG file successfully', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });


      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      };

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext),
        toBlob: vi.fn((callback) => callback(mockBlob)),
      };
      let createdImage: any

      vi.stubGlobal(
        'Image',
        vi.fn().mockImplementation(function () {
          let _src = '';
          createdImage = {
            naturalWidth: 200,
            naturalHeight: 150,
            onload: null,
            onerror: null,
          };

          Object.defineProperty(createdImage, 'src', {
            get() {
              return _src;
            },
            set(val: string) {
              _src = val;

              // simulate async image load success
              queueMicrotask(() => {
                createdImage.onload?.();
              });
            },
          });

          return createdImage;
        })
      );

      vm.inputElement = { files: [mockFile] };
      vm.canvas = mockCanvas;

      const uploadPromise = vm.onFileUpload();

      // Trigger image onload
      setTimeout(() => {
        if (createdImage.onload) createdImage.onload();
      }, 0);

      await uploadPromise;

      expect(mockCanvas.width).toBe(200);
      expect(mockCanvas.height).toBe(150);
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 200, 150);
      expect(mockContext.drawImage).toHaveBeenCalledWith(createdImage, 0, 0);
      expect(vm.downloadUrl).toBe('mock-object-url');
      expect(vm.filename).toBe('test.jpeg');
    });

    it('should handle conversion errors gracefully', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: '',
      };

      global.Image = vi.fn().mockImplementation(() => mockImage) as any;

      vm.inputElement = { files: [mockFile] };

      const uploadPromise = vm.onFileUpload();

      // Trigger image onerror
      setTimeout(() => {
        if (mockImage.onerror) mockImage.onerror();
      }, 0);

      await uploadPromise;

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'error the file upload did not proceede correctly\n'
      );
      expect(global.alert).toHaveBeenCalledWith('conversion failed');

      consoleErrorSpy.mockRestore();
    });

    it('should revoke old download URL before creating new one', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      let createdImage : any
      vi.stubGlobal(
        'Image',
        vi.fn().mockImplementation(function () {
          let _src = '';
          createdImage = {
            naturalWidth: 200,
            naturalHeight: 150,
            onload: null,
            onerror: null,
          };

          Object.defineProperty(createdImage, 'src', {
            get() {
              return _src;
            },
            set(val: string) {
              _src = val;

              // simulate async image load success
              queueMicrotask(() => {
                createdImage.onload?.();
              });
            },
          });

          return createdImage;
        })
      );
      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      };

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext),
        toBlob: vi.fn((callback) => callback(mockBlob)),
      };
      vm.inputElement = { files: [mockFile] };
      vm.canvas = mockCanvas;
      vm.downloadUrl = 'old-url';

      const uploadPromise = vm.onFileUpload();


      await uploadPromise;

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('old-url');
    });

    it('should handle case when canvas context is null', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: '',
        naturalWidth: 200,
        naturalHeight: 150,
      };

      const mockCanvas = {
        getContext: vi.fn(() => null),
      };

      global.Image = vi.fn().mockImplementation(() => mockImage) as any;

      vm.inputElement = { files: [mockFile] };
      vm.canvas = mockCanvas;

      const uploadPromise = vm.onFileUpload();

      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      await uploadPromise;

      expect(vm.downloadUrl).toBeNull();
    });
  });

  describe('File input change event', () => {
    it('should trigger onFileUpload when file is selected', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;
      const onFileUploadSpy = vi.spyOn(vm, 'onFileUpload');

      const fileInput = wrapper.find('input[type="file"]');
      await fileInput.trigger('change');

      expect(onFileUploadSpy).toHaveBeenCalled();
    });
  });

  describe('Download button', () => {
    it('should show download button when downloadUrl is set', async () => {
      wrapper = mount(PngToJpeg, {
        global: {
          stubs: {
            UButton: {
              template: '<a :href="to" :download="download"><slot /></a>',
              props: ['to', 'download', 'variant', 'color', 'size', 'icon']
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      vm.downloadUrl = 'mock-download-url';
      vm.filename = 'test.jpeg';

      await wrapper.vm.$nextTick();

      const downloadButton = wrapper.find('a[download]');
      expect(downloadButton.exists()).toBe(true);
      expect(downloadButton.attributes('href')).toBe('mock-download-url');
      expect(downloadButton.attributes('download')).toBe('test.jpeg');
    });
  });

  describe('Filename conversion', () => {
    it('should replace .png extension with .jpeg (lowercase)', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'myimage.png', { type: 'image/png' });
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: '',
        naturalWidth: 100,
        naturalHeight: 100,
      };

      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      };

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext),
        toBlob: vi.fn((callback) => callback(mockBlob)),
      };

      global.Image = vi.fn().mockImplementation(() => mockImage) as any;

      vm.inputElement = { files: [mockFile] };
      vm.canvas = mockCanvas;

      const uploadPromise = vm.onFileUpload();

      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      await uploadPromise;

      expect(vm.filename).toBe('myimage.jpeg');
    });

    it('should replace .PNG extension with .jpeg (uppercase)', async () => {
      wrapper = mount(PngToJpeg);
      const vm = wrapper.vm as any;

      const mockFile = new File([''], 'PHOTO.PNG', { type: 'image/png' });
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

      const mockImage = {
        onload: null as any,
        onerror: null as any,
        src: '',
        naturalWidth: 100,
        naturalHeight: 100,
      };

      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      };

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext),
        toBlob: vi.fn((callback) => callback(mockBlob)),
      };

      global.Image = vi.fn().mockImplementation(() => mockImage) as any;

      vm.inputElement = { files: [mockFile] };
      vm.canvas = mockCanvas;

      const uploadPromise = vm.onFileUpload();

      setTimeout(() => {
        if (mockImage.onload) mockImage.onload();
      }, 0);

      await uploadPromise;

      expect(vm.filename).toBe('PHOTO.jpeg');
    });
  });
});
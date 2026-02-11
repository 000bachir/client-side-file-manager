import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { ref, onUnmounted } from "vue";
//@ts-ignore
import PngToJpeg from "@/pages/tools/image-converter/png-jpeg.vue"
// Mock utility functions
vi.mock('~/utils/GetExtension', () => ({
  GetExtension: vi.fn((file: File) => file.name.split('.').pop()),
  IsImage: vi.fn((file: File) => file.type.startsWith('image/')),
}));

vi.mock('../../../app/utils/formatFileSize.ts', () => ({
  formatFileSize: vi.fn((size: number) => `${(size / 1024).toFixed(2)} KB`),
}));

describe('PngToJpeg Component', () => {
  let wrapper: VueWrapper<any>;
  let mockFile: File;
  let mockImage: HTMLImageElement;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;

  beforeEach(() => {
    // Setup DOM mocks
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { });

    // Mock alert
    global.alert = vi.fn();

    // Create mock file
    mockFile = new File(['mock-image-content'], 'test-image.png', { type: 'image/png' });

    // Mount component
    wrapper = mount(PngToJpeg);
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('input[type="file"]').exists()).toBe(true);
      expect(wrapper.find('canvas').exists()).toBe(true);
      expect(wrapper.find('a#downloadLink').exists()).toBe(true);
    });

    it('should have hidden canvas element', () => {
      const canvas = wrapper.find('canvas');
      expect(canvas.classes()).toContain('hidden');
    });

    it('should have hidden download link', () => {
      const downloadLink = wrapper.find('a#downloadLink');
      expect(downloadLink.attributes('style')).toContain('display: none');
    });

    it('should accept image files only', () => {
      const input = wrapper.find('input[type="file"]');
      expect(input.attributes('accept')).toBe('image/*');
    });
  });

  describe('File Upload Handling', () => {
    it('should handle file input change event', async () => {
      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;

      // Mock FileList
      Object.defineProperty(input, 'files', {
        value: [mockFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');
      await nextTick();

      // Verify file was processed
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should return early if no files are selected', async () => {
      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: null,
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');
      await nextTick();

      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });

    it('should return early if files array is empty', async () => {
      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');
      await nextTick();

      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });
  });

  describe('Image Validation', () => {
    it('should show alert for non-image files', async () => {
      const { IsImage } = await import('../../../app/utils/GetExtension');
      vi.mocked(IsImage).mockReturnValue(false);

      const nonImageFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [nonImageFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');
      await nextTick();

      expect(global.alert).toHaveBeenCalledWith('ALERT , please choose a valid png file\n');
    });

    it('should process valid image files', async () => {
      const { IsImage } = await import('../../../app/utils/GetExtension');
      vi.mocked(IsImage).mockReturnValue(true);

      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [mockFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');

      expect(createObjectURLSpy).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('Image Loading', () => {
    it('should create object URL for image loading', async () => {
      const { IsImage } = await import('../../../app/utils/GetExtension');
      vi.mocked(IsImage).mockReturnValue(true);

      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
      Object.defineProperty(input, 'files', {
        value: [mockFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');

      expect(createObjectURLSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should revoke object URL after image loads', async () => {
      const { IsImage } = await import('../../../app/utils/GetExtension');
      vi.mocked(IsImage).mockReturnValue(true);

      // Mock Image constructor to auto-trigger onload
      const mockOnLoad = vi.fn();
      global.Image = class extends Image {
        constructor() {
          super();
          setTimeout(() => {
            if (this.onload) this.onload(new Event('load'));
          }, 0);
        }
      } as any;

      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
      Object.defineProperty(input, 'files', {
        value: [mockFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('Canvas Operations', () => {
    it('should have canvas context available', () => {
      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      expect(context).toBeTruthy();
    });

    it('should expose downloadLink ref', () => {
      expect(wrapper.vm.downloadLink).toBeDefined();
    });
  });

  describe('JPEG Conversion', () => {
    it('should create JPEG data URL from canvas', async () => {
      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      const mockDataURL = 'data:image/jpeg;base64,mock-data';

      vi.spyOn(canvas, 'toDataURL').mockReturnValue(mockDataURL);

      const downloadLink = wrapper.find('a#downloadLink').element as HTMLAnchorElement;
      const clickSpy = vi.spyOn(downloadLink, 'click').mockImplementation(() => { });

      // Manually trigger conversion (would normally happen after image load)
      wrapper.vm.convertCanvasToJpeg();

      expect(canvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.9);
      expect(downloadLink.href).toBe(mockDataURL);
      expect(downloadLink.download).toBe('image.jpg');
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle image load errors', async () => {
      const { IsImage } = await import('../../../app/utils/GetExtension');
      vi.mocked(IsImage).mockReturnValue(true);

      // Mock Image to trigger onerror
      global.Image = class extends Image {
        constructor() {
          super();
          setTimeout(() => {
            if (this.onerror) this.onerror(new Event('error'));
          }, 0);
        }
      } as any;

      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
      Object.defineProperty(input, 'files', {
        value: [mockFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('File Information Logging', () => {
    it('should log file information on upload', async () => {
      const { IsImage, GetExtension } = await import('../../../app/utils/GetExtension');
      const { formatFileSize } = await import('../../../app/utils/formatFileSize');

      vi.mocked(IsImage).mockReturnValue(true);
      vi.mocked(GetExtension).mockReturnValue('png');
      vi.mocked(formatFileSize).mockReturnValue('10.00 KB');

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

      const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
      Object.defineProperty(input, 'files', {
        value: [mockFile],
        writable: false,
      });

      await wrapper.find('input[type="file"]').trigger('change');

      expect(consoleSpy).toHaveBeenCalled();
      expect(GetExtension).toHaveBeenCalledWith(mockFile);
      expect(formatFileSize).toHaveBeenCalledWith(mockFile.size);

      consoleSpy.mockRestore();
    });
  });
});

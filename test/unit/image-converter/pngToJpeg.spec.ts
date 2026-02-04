import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PngJpeg from '~/pages/tools/image-converter/png-jpeg.vue'

// ---- Mock browser APIs used in the component ----
beforeEach(() => {
    vi.resetAllMocks()

    // Mock createImageBitmap
    global.createImageBitmap = vi.fn().mockResolvedValue({
        width: 100,
        height: 100
    })

    // Mock canvas and toBlob
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
        drawImage: vi.fn()
    })

    HTMLCanvasElement.prototype.toBlob = function (callback: any) {
        callback(new Blob(['mock'], { type: 'image/png' }))
    }

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
})

function createMockFile(name: string, type: string, size = 1000) {
    return new File(['dummy'], name, { type })
}

describe('ImageConverter Component', () => {
    it('renders the component correctly', () => {
        const wrapper = mount(PngJpeg)
        expect(wrapper.exists()).toBe(true)
    })

    it('rejects unsupported file extension', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        const wrapper = mount(PngJpeg)
        const input = wrapper.find('input[type="file"]')

        const file = createMockFile('test.txt', 'text/plain')

        Object.defineProperty(input.element, 'files', {
            value: [file]
        })

        await input.trigger('change')

        expect(consoleSpy).toHaveBeenCalled()
        expect(wrapper.find('a').attributes("href")).toBeNull()
    })

    it('rejects unsupported mime type', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        const wrapper = mount(PngJpeg)
        const input = wrapper.find('input[type="file"]')

        const file = createMockFile('image.jpg', 'application/pdf')

        Object.defineProperty(input.element, 'files', {
            value: [file]
        })

        await input.trigger('change')

        expect(consoleSpy).toHaveBeenCalled()
        expect(wrapper.find('a').attributes("href")).toBeNull()
    })

    it('rejects file that is too large', async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { })

        const wrapper = mount(PngJpeg)
        const input = wrapper.find('input[type="file"]')

        const largeFile = new File(['x'.repeat(17_000_000)], 'big.jpg', {
            type: 'image/jpeg'
        })

        Object.defineProperty(input.element, 'files', {
            value: [largeFile]
        })

        await input.trigger('change')

        expect(alertSpy).toHaveBeenCalled()
        expect(wrapper.find('a').attributes("href")).toBeNull()
    })

    it('converts valid JPEG file to PNG and sets download URL', async () => {
        const wrapper = mount(PngJpeg)
        const input = wrapper.find('input[type="file"]')

        const file = createMockFile('photo.jpg', 'image/jpeg')

        Object.defineProperty(input.element, 'files', {
            value: [file]
        })

        await input.trigger('change')

        await wrapper.vm.$nextTick()

        expect(wrapper.find('a').attributes("href")).toBe('mock-url')
        expect(wrapper.vm.filename).toBe('photo.png')
    })

    it('does not convert PNG file and alerts user', async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { })

        const wrapper = mount(PngJpeg)
        const input = wrapper.find('input[type="file"]')

        const file = createMockFile('image.png', 'image/png')

        Object.defineProperty(input.element, 'files', {
            value: [file]
        })

        await input.trigger('change')

        expect(alertSpy).toHaveBeenCalled()
        expect(wrapper.find('a').attributes("href")).toBeNull()
    })
})

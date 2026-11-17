<!--!PNG TO JPEG-->
<!--TODO : need to add loading bar after and some tests need to be fixed-->
<!--TODO : NEED TO ADD RESPONSIVENESS-->

<script setup lang="ts">

import { LoadImage } from './ImageUtils/loadImage'
import DropZone from '../components/DropZone.vue'
import { FormatSize } from './ImageUtils/FormatSize'
import type { Result } from './ImageUtils/Results'

const results = ref<Result[]>([])
const quality = ref(0.9)
let nextId = 0



async function convertToJpeg(file: File, quality: number = 0.9): Promise<Blob> {
  const image = await LoadImage(file);
  if (!image.naturalHeight || !image.naturalWidth) {
    throw new Error("Image has no dimensions\n")
  }
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas do not possess a 2d context\n")

  } else {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0)
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('jpeg conversion failed'))),
        'image/jpeg',
        quality
      )
    })
  }
}
// FIX: replaces onFileUpload. It now receives files from DropZone's `add` event
// instead of reading a hidden input that was never bound.
// Removed: the PNG-only check (the dropzone already filters to images and canvas
// converts any image the browser can decode), the duplicate preview-canvas block
// (it had the invalid fillStyle "fffff" and loaded the image a second time),
// and the single-file limitation.

async function onAdd(files: File[]) {
  for (const file of files) {
    const item = reactive<Result>({
      id: nextId++,
      name: file.name.replace(/\.[^.]+$/, '') + '.jpeg',
      status: 'converting',
      originalSize: file.size
    })
    results.value.push(item)

    try {
      const blob = await convertToJpeg(file, quality.value);
      item.url = URL.createObjectURL(blob);
      item.newSize = blob.size;
      item.status = "done"
    } catch (error) {
      console.error(error)
      item.status = "error"
    }


  }
}


function downloadAll() {
  results.value.filter(result => result.status === "done" && result.url).forEach((result, index) => {
    setTimeout(() => {
      const a = document.createElement("a")
      a.href = result.url!,
        a.download = result.name,
        a.click()
    }, index * 200)
  })
}


function onClear() {
  //@ts-ignore
  results.value.forEach(r => URL.revokeObjectURL(r.url));
  results.value = [];
}
onBeforeMount(onClear);
const doneCount = computed(() => results.value.filter(r => r.status === 'done').length)
</script>


<template>
  <main class="h-auto w-full relative overflow-hidden flex flex-col items-center justify-center gap-2">
    <div id="drop-zone-container"
      class="h-auto w-[95%] mx-auto relative overflow-hidden p-8  flex items-center justify-center">
      <DropZone @add="onAdd" @clear="onClear" />
    </div>
    <div id="slider-range-container"
      class="h-auto w-[95%] mx-auto relative overflow-hidden p-8 flex items-center justify-center flex-col">
      <label class="quality flex items-center justify-center gap-4 ">
        Quality: {{ Math.round(quality * 100) }}%
        <input class="slider" v-model.number="quality" type="range" min="0.5" max="0.9" step="0.05" />
      </label>
      <ul v-if="results.length" class="results  w-full h-auto relative overflow-hidden py-8 px-9">
        <li v-for="r in results" :key="r.id"
          class="result-row h-full w-full relative overflow-hidden py-4 px-5 flex flex-col items-center justify-center gap-3">
          <span class="result-name font-semibold text-sm">{{ r.name }}</span><br>
          <span v-if="r.status === 'converting'" class="spinner" aria-label="Converting" />
          <template v-else-if="r.status === 'done'">
            <span class="result-size text-lg font-semibold text-center ">From :{{ FormatSize(r.originalSize) }} → To: {{
              FormatSize(r.newSize!) }}</span><br>
            <a class="btn" id="btn-1" :href="r.url" :download="r.name">Download</a>
          </template>

          <span v-else class="result-error ">Failed to convert</span>
        </li>
      </ul>

      <button label="Download all" v-if="doneCount > 1" class="btn download-all" @click="downloadAll">
        ({{ doneCount }})
      </button>

    </div>

  </main>
</template>
<style>
.drop-zone {
  height: 600px;
  aspect-ratio: 1;

  display: flex;
  align-items: center;
  justify-content: center;
}

.slider::-webkit-slider-thumb {

  /* Chrome,
  Safari,
  Edge */

  appearance: none;
  width: 20px;
  height: 20px;
  background: #6366f1;
  border-radius: 50%;
  cursor: pointer;
}

/* Firefox */
.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: yellow;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

/* Firefox track */
.slider::-moz-range-track {
  width: 100%;
  height: 8px;
  background: #ccc;
  border-radius: 10px;
}


.btn {
  color: white;
  cursor: pointer;
  padding: 1rem 0.7rem;
  border-radius: .3rem;
  font-size: 16px;
  font-weight: 500;
  line-height: 2.5rem;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
}

#btn-1 {
  border: 1px solid;
  overflow: hidden;

  span {
    z-index: 20;
  }

  &:after {
    background: #fff;
    content: "";
    height: 155px;
    left: -75px;
    opacity: .2;
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 50px;
    z-index: -10;
  }
}

#btn-1:hover {

  &:after {
    left: 120%;
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
  }
}

/* DOWNLOAD ALL BUTTON */
.download-all {
  border: 0 solid;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0);
  outline: 1px solid;
  outline-color: rgba(255, 255, 255, .5);
  outline-offset: 0px;
  text-shadow: none;
  transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
}

.download-all:hover {
  border: 1px solid;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, .5), 0 0 20px rgba(255, 255, 255, .2);
  outline-color: rgba(255, 255, 255, 0);
  outline-offset: 15px;
  text-shadow: 1px 1px 2px #427388;
}
</style>

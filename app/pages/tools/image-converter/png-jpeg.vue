<!--!PNG TO JPEG-->

<!--TODO : need to add loading bar after and some tests need to be fixed-->


<script setup lang="ts">
import { ref } from 'vue';
import { validateMessage } from '~/utils/validateMessage';
/**
 * !state
 */
const inputElement = ref<HTMLInputElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const downloadUrl = ref<string | null>(null);
const filename = ref<string>("image-converted.jpeg")



//load the image 
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let image = new Image();
    let objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("failed to load the image properly\n"))
    }

    image.src = objectUrl;

  })
}

function convertCanvasToJpegImage(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resovle, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("jpeg conversion failed\n"))
        return
      }
      resovle(blob)
    }, "image/jpeg", 0.9)
  })
}



async function onFileUpload() {
  const fileInput = inputElement.value?.files;
  if (!fileInput) return;
  let file = fileInput[0]
  if (!file) return;


  // image validation
  if (file.type !== "image/png") {
    validateMessage("please select a valid png image\n")
    return;
  }

  try {
    const image = await loadImage(file)
    const Canvas = canvas.value
    if (!Canvas) return;

    let context = Canvas.getContext("2d");
    if (!context) return;


    Canvas.width = image.naturalWidth;
    Canvas.height = image.naturalHeight;

    //white backgroud for transparency 

    context.fillStyle = "fffff";
    context.fillRect(0, 0, Canvas.width, Canvas.height);
    context.drawImage(image, 0, 0);

    const jpegBlob = await convertCanvasToJpegImage(Canvas);


    if (downloadUrl.value) {
      URL.revokeObjectURL(downloadUrl.value)
    }
    downloadUrl.value = URL.createObjectURL(jpegBlob)
    filename.value = file.name.replace(/\.png$/i, ".jpeg")


  } catch (err) {
    console.error("error the file upload did not proceede correctly\n")
    validateMessage("conversion failed")
  }

}


</script>

<template>
  <main class="h-auto w-full relative overflow-hidden">
    <section class="h-dvh w-full relative overflow-hidden grid grid-cols-2">
      <div id="input_col" class="h-full w-full relative overflow-hidden ">
        <form action="" method="post" class="h-full w-[95%] mx-auto flex flex-col items-center justify-center">
          <input ref="inputElement" type="file" accept="image/*"
            class="border border-amber-50 p-8 rounded-3xl shadow-2xl" @change="onFileUpload">
          <canvas class="hidden" ref="canvas"></canvas>
          <!-- <a id="downloadLink" ref="downloadLink" class="hidden text-amber-300">Download JPEG</a> -->
          <UButton v-if="downloadUrl" :to="downloadUrl" :download="filename" variant="outline" color="success" size="xl"
            icon="i-lucide-rocket" class="flex items-center justify-center">
            Download JPEG
          </UButton>
        </form>
      </div>
      <div id="text_col" class=""></div>
    </section>
  </main>
</template>

<style>
input[type="file"]::file-selector-button {
  content: none;
}

</style>

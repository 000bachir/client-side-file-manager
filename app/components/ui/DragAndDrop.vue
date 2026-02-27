<script setup lang="ts">

const clearBtn = ref<HTMLButtonElement | null>(null);
const dropZone = ref<HTMLElement | null>(null);

dropZone.value?.addEventListener("drop" , dropHandler);


window.addEventListener("drop" , (event : any)=>{
    if([...event.dataTransfer.items].some((item)=> item.kind === "file")){
        event.preventDefault()
    }
})


function dropHandler(){
    return
}
</script>


<template>
    <label id="drop-zone" ref="dropZone" class="flex items-center justify-center w-[500px] max-w-full h-[200px] border border-white rounded-2xl cursor-pointer">
        Drop file here , or click to upload
        <input type="file" id="file-input" class="none" multiple accept="image/*">
    </label>
    <ul id="preview" class="w-[500px] max-w-full flex flex-col gap-0.5 p-0"></ul>
    <button ref="clearBtn"> CLEAR </button>
</template>


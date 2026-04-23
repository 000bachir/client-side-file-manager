<script setup lang="ts">
    import { GetExtension } from '~/utils/GetExtension';
    import { IsPdf } from '~/utils/IspdfFile';


    const fileInput = ref<HTMLInputElement | null>(null);
    const filename = ref<string>("");
    const downloadUrl = ref<string | null>(null)
    const isLoading = ref<boolean>(false)

    function fileSizeLimit(file : File) : [string , boolean] | false {
        if(!file){
            return false
        }
        const MaxfileSize : number = 50 * 1024 * 1024
    
        if(file.size > MaxfileSize){
            alert("file too big , could not process it\n")
            return false
        }
        
        return[
            "file size is in range of actions" , 
            true
        ]
    }


    function onFileSelect(){
        return "hello world "
    }
</script>

<template>
    <main class="h-auto w-full relative overflow-hidden">

        <main class="h-auto w-full relative overflow-hidden">
            <section class="h-dvh w-full relative grid grid-cols-2">
                <article class="col-span-1 h-full w-full relative overflow-hidden flex flex-col items-center justify-center "
                    id="file_side_operations">
                    <div class="h-full w-full relative overflow-hidden flex items-center justify-center ">
                        <!--file form input element-->
                        <form action="" class=" h-full w-full flex  justify-start flex-col gap-6" method="post"
                            enctype="multipart/form-data">
                            <div class="relative w-[95%] mx-auto flex items-center justify-center flex-col gap-6 ">
                                <label for="input-group-1" class="text-heading font-semibold text-xl text-left">
                                    Select file</label>
                                <input type="file" id="input-group-1" @change="onFileSelect" ref="fileInput"
                                    accept="application/pdf"
                                    class="w-full mx-auto p-6  border border-white text-heading text-xl rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body hover:bg-green-600">
                            </div>
                            <div class=" py-4 w-full flex items-center justify-center">

                                <UButton :href="downloadUrl || undefined" tag="a" :loading="isLoading"
                                    :disabled="!downloadUrl || isLoading" :download="filename" variant="outline"
                                    color="success" size="xl" icon="i-lucide-rocket" class="text-xl font-semibold">
                                    Download PDF
                                </UButton>
                            </div>
                        </form>
                    </div>

                </article>
                <div class="col-span-1 h-full w-full relative overflow-hidden flex items-center justify-center flex-col gap-6 bg-amber-300"
                    id="prompt_side_operations">

                </div>
            </section>
        </main>
    </main>
</template>
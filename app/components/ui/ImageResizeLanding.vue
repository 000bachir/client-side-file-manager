<script setup lang="ts">

const pre = ref<any | null>(null);
const section = ref<any | null>(null);
if (!pre.value) {
    throw new Error("couldn't find the pre element in the dom")
}

if (!section.value) {
    throw new Error("couldn't find the section element in the dom")
}

section.value.addEventListener("mousemove", (event: MouseEvent) => {
    rotateElement(event, pre.value)
})

function rotateElement(event: MouseEvent, element: HTMLElement) {
    const x: number = event.clientX;
    const y: number = event.clientY;

    if (!x && !y) {
        return
    }

    const middleX = section.value.innerWidth / 2

    const middleY = section.value.innerWidth / 2

    // get offset from middle as a percentage
    // and tone it down a little
    const offsetX = ((x - middleX) / middleX) * 45;
    const offsetY = ((y - middleY) / middleY) * 45;
    // console.log(offsetX, offsetY);

    // set rotation
    element.style.setProperty("--rotateX", offsetX + "deg");
    element.style.setProperty("--rotateY", -1 * offsetY + "deg");

}




</script>


<template>

    <section ref="section" class="h-dvh w-full relative flex items-center justify-center ">

        <pre ref="pre" contenteditable class="language-css" tabindex="0"><code class="language-css"><span class="token selector">Re-size Image</span> <span class="token punctuation">{</span>
    <span class="token property">display</span><span class="token punctuation">:</span> needed<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

    </section>

</template>


<style>
:root {
    --pink: hsl(338, 70%, 55%);
    --teal: hsl(183, 70%, 62%);
    --white: hsl(334, 7%, 95%);
}


pre {
    --selector: var(--pink);
    --property: var(--teal);
    --undefined: var(--white);
    --punctuation: var(--white);

    font-size: 3rem;
    color: var(--undefined);
    background: hsl(222, 45%, 7%);
    padding: 2rem;
    border-radius: 1rem;
    position: relative;
    transform-style: preserve-3d;
    transform: perspective(5000px) rotateY(var(--rotateX)) rotateX(var(--rotateY));

}


pre>* {
    text-shadow: 0 0 0.3em currentColor;
}

pre::before,
pre::after {
    content: "";
    position: absolute;
    border-radius: inherit;
}

/* shadow */

pre::before {
    inset: 0.75rem;
    border-radius: inherit;
    background: black;
    z-index: -1;
    transform: translateZ(-50px);
    filter: blur(15px);
    opacity: 0.5;
}

pre::after {
    z-index: -2;
    inset: -1rem;
    background: linear-gradient(-45deg, red, blue);
    transform: translateZ(-50px);
}


.selector {
    color: var(--selector);
}

.property {
    color: var(--property);
}

.punctuation {
    color: var(--punctuation);
}

.property+.punctuation {
    color: var(--property);
}

.pre-container {
    position: relative;
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
}
</style>
<script setup lang="ts">

interface Props {
    height?: number | string
    width?: number | string
    fill?: string
}

const Props = defineProps<Props>()

</script>

<template>


    <svg xmlns="http://www.w3.org/2000/svg" :width="Props.width ?? '1rem'" :height="Props.height ?? '1rem'"
        viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
            <path stroke-linejoin="round"
                d="M7 15v-3m0 0V9h3v3zm9-3h-3v6h3m6-6h-3v6h3v-2.4M4 9v4.2C4 15 2 15 2 15m11-3h2" />
            <path
                d="M4 6V3.6a.6.6 0 0 1 .6-.6h14.8a.6.6 0 0 1 .6.6V6M4 18v2.4a.6.6 0 0 0 .6.6h14.8a.6.6 0 0 0 .6-.6V18" />
        </g>
    </svg>




</template>
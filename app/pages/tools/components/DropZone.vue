<script setup lang="ts">
import { ja } from '@nuxt/ui/runtime/locale/index.js';


    const fileInput = ref<HTMLInputElement | null>(null);

    function handleFileSelect(event : Event){
        const input = event.target as HTMLInputElement;
        if(!input.files) return

        handleFiles(input.files)
    }
    function HandleDrop(event : DragEvent){
        event.preventDefault();
        if(!event.dataTransfer?.files)return
    }

    
</script>

<template>
    <div class="content-layer">
        <div  class="file-upload" id="dropZone">
            <input ref="fileInput" multiple accept="image/*" class="file-input" id="fileInput" type="file" @change="OnfileDrop" />
            <label class="file-label" id="uploadState" for="fileInput">
                <div class="upload-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#gradientColor)"
                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <defs>
                            <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="5%" stop-color="#7eaaff"></stop>
                                <stop offset="95%" stop-color="#ff48fb"></stop>
                            </linearGradient>
                        </defs>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
                <h3>Drag & Drop</h3>
                <p>click or press <strong>Ctrl+V</strong> to paste</p>
                <div class="limit-text-container" id="limitTextContainer">
                    <p class="limit-text-default">Max File Size: 25 MB &bull;</p>
                </div>
                <div class="info-text">Uploaded images are automatically deleted</div>
                <div class="error-msg" id="errorMsg"></div>
            </label>
            <div class="upload-state" id="progressState">
                <div class="file-list" id="fileList"></div>
                <button class="new-upload-btn" id="newUploadBtn">Upload New Images</button>
                <button class="cancel-btn" id="cancelBtn">Cancel All</button>
            </div>
        </div>
    </div>
</template>

<style>
/* base colors and variables */
:root {
    --bg-deep: #090a0f;
    --bg-mid: #1b2735;
    --glass: rgba(30, 30, 35, 0.6);
    --glass-hover: rgba(45, 45, 50, 0.8);
    --accent-blue: #7eaaff;
    --accent-pink: #ff48fb;
    --text-primary: #ffffff;
    --text-muted: #94a3b8;
    --danger: #ef4444;
    --success: #4ade80;
    --gradient-main: linear-gradient(90deg, var(--accent-blue), var(--accent-pink));
    --radius-lg: 24px;
    --radius-md: 16px;
    --radius-sm: 8px;
    --radius-pill: 50px;
}

.content-layer {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 800px;
    padding: 20px;
}

.file-upload {
    position: relative;
    border: 2px dashed rgba(126, 170, 255, 0.4);
    border-radius: var(--radius-lg);
    padding: 60px 40px;
    text-align: center;
    background-color: var(--glass);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    will-change: transform;
}

.file-upload:hover {
    border-color: var(--accent-pink);
    background-color: var(--glass-hover);
    transform: scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
        0 0 40px rgba(255, 72, 251, 0.08);
}

.file-upload.dragover {
    background-color: rgba(126, 170, 255, 0.15);
    border-color: var(--accent-blue);
    transform: scale(1.05);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
        0 0 60px rgba(126, 170, 255, 0.12);
}

.file-input {
    display: none;
}

.file-label {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-icon {
    margin-bottom: 20px;
    transition: transform 0.4s ease;
    will-change: transform;
}

.file-upload:hover .upload-icon {
    transform: translateY(-10px);
}

.file-upload h3 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 600;
}

.file-upload p {
    font-size: 14px;
    margin-bottom: 5px;
}

.info-text {
    margin-top: 20px;
    font-size: 18px;
    color: var(--danger);
    background: rgba(239, 68, 68, 0.1);
    padding: 8px 15px;
    border-radius: var(--radius-pill);
    display: inline-block;
}

.limit-text-container {
    position: relative;
    height: 18px;
    width: 100%;
    margin-top: 15px;
    display: flex;
    justify-content: center;    
}

/* upload state and list */
.upload-state {
    display: none;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.file-list {
    width: 100%;
    max-height: 350px;
    overflow-y: auto;
    padding-right: 5px;
}

.file-list::-webkit-scrollbar {
    width: 5px;
}

.file-list::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.file-list::-webkit-scrollbar-thumb {
    background: rgba(126, 170, 255, 0.5);
    border-radius: 5px;
}

.file-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: var(--radius-md);
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    text-align: left;
    animation: fileItemIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes fileItemIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.file-preview {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.file-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
}

.file-name {
    font-size: 14px;
    color: white;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* progress bar and link area */
.file-bottom-row {
    position: relative;
    width: 100%;
    height: 32px;
}

.file-progress-container {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.3s ease;
}

.file-progress-bar {
    height: 100%;
    width: 0%;
    background: var(--gradient-main);
    border-radius: 10px;
    transition: width 0.15s ease;
}

.file-link-box {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 10px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.file-link-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(126, 170, 255, 0.3);
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    color: var(--accent-blue);
    font-size: 11px;
    font-family: 'Poppins', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: all 0.2s;
}

.file-link-input:hover {
    background: rgba(126, 170, 255, 0.1);
    border-color: var(--accent-blue);
    color: white;
}

.file-copy-btn {
    background: var(--gradient-main);
    border: none;
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    color: white;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 12px;
    transition: opacity 0.3s, transform 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
}

.file-copy-btn:hover {
    opacity: 0.85;
    transform: scale(1.05);
}

/* buttons */
.new-upload-btn,
.cancel-btn {
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 20px;
    border-radius: 12px;
    color: white;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    margin-top: 10px;
    transition: all 0.3s;
    display: none;
    width: 100%;
}

.new-upload-btn {
    background: rgba(255, 255, 255, 0.08);
}

.new-upload-btn:hover {
    background: rgba(126, 170, 255, 0.2);
    border-color: var(--accent-blue);
    transform: translateY(-2px);
}

.cancel-btn {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.25);
}

.cancel-btn:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: var(--danger);
    transform: translateY(-2px);
}

/* error messages */
.error-msg {
    color: var(--danger);
    font-size: 13px;
    margin-top: 15px;
    display: none;
    background: rgba(239, 68, 68, 0.08);
    padding: 10px 16px;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(239, 68, 68, 0.15);
    line-height: 1.6;
}

/* mobile responsiveness */
@media (max-width: 768px) {
    * {
        cursor: auto !important;
    }

    html,
    body {
        overflow-y: auto;
    }

    .file-upload {
        padding: 40px 20px;
        min-height: 280px;
    }

    .file-list {
        max-height: 250px;
    }

    .file-copy-btn {
        padding: 10px 16px;
        font-size: 14px;
    }

    .cancel-btn,
    .new-upload-btn {
        padding: 14px 20px;
    }
}
</style>
<template>
    <div class="bm-modal-backdrop" @click="close">
        <div class="bm-modal" @click.stop>
            <header class="bm-modal-title-wrapper">
                <h3 class="bm-modal-title">{{ title }}</h3>
                <div class="bm-btn-close" @click.stop="close">
                    <CloseModalIcon />
                </div>
            </header>
            <section class="bm-modal-body">
                <slot name="modalContent" />
            </section>
        </div>
    </div>
</template>

<script setup>
import CloseModalIcon from '~/icons/CloseModalIcon.vue'
// ⬆️ Move your icon Vue file from assets to components/icons

defineProps({
    title: {
        type: String,
        required: false
    }
})

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}
</script>

<style scoped>
*:not(i) {
    font-family: 'Rethink Sans' !important;
}

.bm-modal-backdrop {
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
    backdrop-filter: blur(2px);
    background: repeating-conic-gradient(#1B1D29 0 0.0001%, #1B1D2980 0 0.0002%) 60% 60%/3000px 3000px;
}

.bm-modal {
    position: relative;
    min-width: 400px;
    height: fit-content;
    margin: 0px 10px;
    z-index: 1000;
    background-color: #15161F;
    display: flex;
    flex-direction: column;
    border-radius: 14px;
}

/* replaced &__title */
.bm-modal__title {
    font-weight: 600;
    font-size: 24px;
    display: block;
    color: #FFFFFF;
    margin-bottom: 30px;
}

/* replaced &-footer */
.bm-modal-footer {
    margin-top: 30px;
    display: flex;
    align-items: center;
}

@media screen and (max-width: 500px) {
    .bm-modal {
        min-width: calc(100vw - 10px);
        width: calc(100vw - 10px);
    }
}

.bm-modal-header {
    padding: 20px;
}

.bm-modal-title-wrapper {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bm-modal-title {
    font-weight: 600;
    font-size: 16px;
    color: #FFFFFF;
    margin: 0px;
    padding: 0px;
    margin-left: 16px;
}

.bm-btn-close {
    height: 24px;
    width: 24px;
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bm-modal-body {
    padding: 0px 1rem 1rem 1rem;
    margin-top: 10px;
}
</style>

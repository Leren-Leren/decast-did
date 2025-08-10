<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <button class="close-button" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  width: 500px;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 0 20px 20px;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .modal-container {
    width: 95vw;
    margin: 10px;
  }
  
  .modal-content {
    padding: 0 16px 16px;
  }
}
</style>

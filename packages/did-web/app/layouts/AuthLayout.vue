<template>
  <div class="page-main">
    <div class="page-main-child">
      <!-- Left Side -->
      <div class="pmc-left-container">
        <div class="pmc-left">
          <div
            class="dd-label flex items-center gap-2 font-mono text-white cursor-pointer"
            @click="redirectToHomePage"
          >
            <DecastLogo />
            <span class="ml-2">Decast</span>
          </div>
          <LockImage />
        </div>
      </div>

      <!-- Right Side -->
      <div class="pmc-right-container">
        <transition name="slide-fade" mode="out-in">
          <slot name="rightContent" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import LockImage from '~/icons/LockImage.vue'
import DecastLogo from '~/icons/DecastLogo.vue'

const router = useRouter()

function redirectToHomePage() {
  router.push('/')
}
</script>

<style scoped>
*:not(i) {
  font-family: 'Rethink Sans' !important;
}

.page-main {
  height: 100vh;
  width: 100vw;
}

.page-main-child {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
}

.pmc-left-container {
  width: 50%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1b1d29;
}

.pmc-left {
  width: 100%;
  height: 100%;
  padding: 30px 70px;
  display: flex;
  flex-direction: column;
}

.pmc-left svg {
  width: auto;
  height: auto;
}

.pmc-left span {
  font-size: 18px;
  font-weight: 500;
}

.pmc-right-container {
  width: 50%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #15161f;
}

/* Animation: slide-fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

/* Animation: slide-fade end*/

@media (max-width: 1024px) {
  .pmc-right {
    width: 100%;
    padding: 70px 40px;
  }
}

@media (max-width: 768px) {
  .pmc-left-container {
    display: none;
  }

  .pmc-right-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .pmc-right {
    padding: 20px;
  }
}
</style>

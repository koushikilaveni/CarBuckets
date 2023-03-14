<template>
  <div class="loader-wrap" style="position: relative">
    <template v-if="!loading">
      <transition name="fade">
        <slot></slot>
      </transition>
    </template>
    <template v-else>
      <transition name="fade">
        <div class="spinner-wrap">
          <span
            class="spinner-border text-primary"
            style="width: 4rem; height: 4rem"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </span>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'ViewLoader',
    props: {
      loading: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .spinner-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100vh;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    overflow: hidden;
  }

  .fade-enter-active {
    animation: fade-in 500ms;
  }
  .fade-leave-active {
    animation: fade-in 250ms reverse;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>

<template>
  <button
    class="btn"
    v-bind="$attrs"
    :disabled="disabled || submitting"
    v-on="inputListeners"
  >
    <span
      v-if="submitting"
      class="spinner-border spinner-border-sm"
      role="status"
    ></span>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      submitting: Boolean,
      disabled: Boolean
    },
    computed: {
      inputListeners: function () {
        return this.$listeners
      }
    }
  }
</script>

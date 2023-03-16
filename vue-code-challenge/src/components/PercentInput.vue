<template>
  <input
    :value="displayValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="$emit('input', Number($event.target.value))"
    v-on:blur="onBlur"
    v-on:focus="onFocus"
  />
</template>
<script>
  export default {
    data: () => ({
      focused: false
    }),
    props: {
      value: {
        type: [String, Number],
        default: ''
      },
      disabled: {
        type: Boolean
      },
      placeholder: {
        type: String
      }
    },
    computed: {
      displayValue() {
        if (!this.focused && this.value) {
          return '%' + this.value
        }
        return this.value
      }
    },
    methods: {
      onBlur() {
        this.focused = false
      },
      onFocus() {
        this.focused = true
      }
    }
  }
</script>

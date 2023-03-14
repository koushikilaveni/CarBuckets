<template>
  <tr class="text-center">
    <td :colspan="cols">
      <span
        class="spinner-border text-primary"
        style="width: 4rem; height: 4rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </span>
    </td>
  </tr>
</template>

<script>
  export default {
    name: 'BidConfigTableLoader',
    props: {
      cols: {
        type: Number,
        default: 1
      }
    }
  }
</script>

<style scoped></style>

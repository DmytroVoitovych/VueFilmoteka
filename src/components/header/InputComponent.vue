<template>
  <input :value="find" @input="$emit('update:find', $event.target.value)" />
</template>
<script>
export default {
  props: ['find'],
  emits: ['update:find'],
};
</script>

<style lang="scss" scoped>
.valid {
  color: green;
}
</style>

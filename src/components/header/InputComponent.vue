<template>
  <input ref="input" :value="find" @input="$emit('update:find', $event.target.value)" />
</template>
<script>
import { ref } from 'vue';

export default {
  props: ['find'],
  emits: ['update:find'],
  expose: ['inputFocus'],

  methods: {
    inputFocus() { 
      this.$el.focus();
      this.$el.showPicker();
       
    }
  }
};


</script>

<style lang="scss" scoped>
.valid {
  color: green;
}
</style>

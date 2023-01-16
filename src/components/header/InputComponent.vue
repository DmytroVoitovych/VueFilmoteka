<template>
    <input v-on="listeners" >
</template>

<script>

export default {
    name: 'CustomInput',
    computed: {
        listeners() {
            console.log(this.$listeners, this.$emit);
            return {
                ...this.$listeners,
                input: event => this.$emit('input', event.target.value)
            }
        }
    }
};
   
</script>

<style lang="scss" scoped>

</style>
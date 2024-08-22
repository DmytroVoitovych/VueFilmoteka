<template>
<datalist >
<option v-for="({title , id, vote_average,release_date } = {} as DatalistProp) of props.optionData" 
:value="transfomDublicateValue(title,release_date)" :key="id" 
:data-id="id" ref="datalistChildren"
 >
rate:&#160;&#10145;{{vote_average?.toFixed(1) ?? 0}}&#160;  data:&#160;&#127916;{{ release_date?.split('-')[0] ?? '' }}

</option>    
</datalist>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DatalistProp } from '../selectionRoom/localType';
import { onMounted } from 'vue';


const props = defineProps<{ optionData: DatalistProp | {}[] }>();
const datalistChildren = ref<HTMLDListElement | []>([])

defineExpose({
datalistChildren    
});

const transfomDublicateValue = (title: string, release_date: string) =>
    title + '  ' + ((props.optionData as DatalistProp[]).filter(e => e.title === title).length === 1 ? '' : `*${release_date}`); 

</script>
<style lang="scss" scoped>


a{
padding: 100%;    
}




</style>
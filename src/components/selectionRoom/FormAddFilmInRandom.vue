<template>
   <form action="">
   <div class="input-conteiner">
   <Label for="addingFilm">Пошук фільму по назві:</Label>
   <input type="search" name="" id="addingFilm"> 
   <input type="button" value="add">
   <div >
    <label :style="{ display: 'flex', alignItems: 'center' }">
      <CheckboxRoot
        v-model:checked="checkboxOne"
        class="CheckboxRoot"
      >
        <CheckboxIndicator class="CheckboxIndicator">
        <Icon icon="radix-icons:check" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span class="Label">Accept terms and conditions.</span>
    </label>
  </div>
   </div>
   <p>Список доданих фільмів</p>
   <ul><li>
   </li>
   </ul>
   </form>     
   
</template>

<script lang="ts" setup>
import { Label, CheckboxRoot, CheckboxIndicator } from 'radix-vue'; 
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const checkboxOne = ref(true);

</script>

<style lang="scss" scoped>


:deep(button){
  all: unset;
}
:deep(.CheckboxRoot) {
  background-color: white;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px black;
  
}

:deep(.CheckboxRoot:hover) {
  background-color: orange;
}
:deep(.CheckboxRoot:focus) {
  box-shadow: 0 0 0 2px black;
}

:deep(.CheckboxIndicator) {
  color: red;
  font-size: xx-large;
  }


.Label {
  color: white;
  padding-left: 15px;
  font-size: 15px;
  line-height: 1;
}


</style>
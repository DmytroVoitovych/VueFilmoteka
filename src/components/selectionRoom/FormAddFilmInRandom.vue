<template>
   <form action="">
   <div class="input-conteiner">
   <Label for="addingFilm">{{ setLangContent()[0] }}</Label>
   <InputComponent type="search" name="fortunSearch" id="addingFilm" />
   <InputComponent type="button" :value="setLangContent()[1].toLowerCase()" />
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
      <span class="Label">{{setLangContent()[2]}}</span>
    </label>
  </div>
   </div>
   <p>{{ setLangContent()[3] }}</p>
   <ul><li>
   </li>
   </ul>
   </form>     
   
</template>

<script lang="ts" setup>
import { Label, CheckboxRoot, CheckboxIndicator } from 'radix-vue'; 
import InputComponent from '../header/InputComponent.vue';
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';
import { featuresStore } from '@/store/storeForFeatures';
import { getFormAddingFilmContent } from './contentLang';

const lang = computed<string>(() => featuresStore.getters.getLanguage);

const setLangContent = ()=> getFormAddingFilmContent(lang.value);

const checkboxOne = ref(false);

</script>

<style lang="scss" scoped>
form{
      border: 2px solid var(--text-color-light-orange);
    padding: 8px;
}

.input-conteiner{
  display: grid;
  margin-bottom: 12px;

  [for=addingFilm]{
    margin-bottom: 4px;
    font-family: inherit;
  font-size: inherit;
  color: inherit;
  }

  #addingFilm{
  grid-area: 2;  
  font-family: inherit;
  font-size: inherit;
     margin-bottom: 8px;
    background-color: inherit;
    border: 0.5px;
    outline: none;
    border-bottom: 0.5px solid var(--text-color-light-orange);
    color: var(--base-text-theme);
    mix-blend-mode: normal;
   }

   #addingFilm:hover,#addingFilm:focus{
    mix-blend-mode: hard-light;
     }
    #addingFilm:hover + input[type=button],#addingFilm:focus + input[type=button]{
    mix-blend-mode: hard-light;
   }

   input[type=button]{
   grid-area: 2;
   margin-bottom: 8px;
   color: inherit;
   background-color: transparent;
    border-radius: 5px;
    border-color: var(--text-color-light-orange);
    border-bottom-left-radius: 0px;
    font-family: inherit;
    font-size: inherit;
    line-height: 1;
    cursor: pointer;
    mix-blend-mode: normal;
     transition: mix-blend-mode 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    input[type=button]:active{
    background: linear-gradient(0deg, rgb(255, 151, 0) 0%, rgb(251, 75, 2) 100%);
    }
  
  input[type=button] + div{
    grid-area: 3;
  }

  input[type=button] + div{
    grid-area: 3;
  }

& + p{
  text-align: center;
}

}

:deep(button){
  all: unset;
}
:deep(.CheckboxRoot) {
  background-color: var(--base-background-theme);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px black;
  
}

:deep(.CheckboxRoot:hover) {
filter: contrast(0.7);
  
}
:deep(.CheckboxRoot:focus) {
  box-shadow: 0 0 0 2px var(--form-mood-sbox-shadow);
}

:deep(.CheckboxIndicator) {
  color: red;
  font-size: xx-large;
  }


.Label {
  color:var( --base-text-theme);
  padding-left: 15px;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
  font-size: 16px;
}


</style>
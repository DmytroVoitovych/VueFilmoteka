<template>
  <form  action="">
    <div class="input-conteiner" >
      <Label for="addingFilm">{{ setLangContent()[0] }}</Label>
      <InputComponent
        type="search"
        name="fortunSearch"
        id="addingFilm"
        list="filmSearchForWheel"
        @keyup="!checkboxOne && findFilm()"
        @change="blurOnInput"
        @focus="(focus = true)"
        ref="input"  
        v-model:find="value"
        autocomplete="off"
        
      />
      <DataListOption
        id="filmSearchForWheel"
        :optionData="transformDataForDataList"
        ref="datalistChildren"
        v-if="!checkboxOne"
      />
      <InputComponent
        type="button"
        :value="setLangContent()[1].toLowerCase()"
        
      />
      <div>
        <label :style="{ display: 'flex', alignItems: 'center' }">
          <CheckboxRoot v-model:checked="checkboxOne" class="CheckboxRoot">
            <CheckboxIndicator class="CheckboxIndicator">
              <Icon icon="radix-icons:check" />
            </CheckboxIndicator>
          </CheckboxRoot>
          <span class="Label">{{ setLangContent()[2] }}</span>
        </label>
      </div>
    </div>
    <p>{{ setLangContent()[3] }}</p>
    <ul>
      <li></li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
import { Label, CheckboxRoot, CheckboxIndicator } from 'radix-vue';
import InputComponent from '../header/InputComponent.vue';
import DataListOption from '../shared/DataListOption.vue';
import { Icon } from '@iconify/vue';
import { computed, reactive, ref } from 'vue';
import { featuresStore } from '@/store/storeForFeatures';
import { getFormAddingFilmContent } from './contentLang';
import { throttle} from 'lodash';
import type { DatalistProp } from './localType';
import MovieAPiServer from '@/helpers/req';
import { watch} from 'vue';
import { onMounted } from 'vue';
import { generatorId } from '../../helpers/generatorId';
import { Confirm } from 'notiflix';
import { tranformObjectForLists } from './helper';

const http = new MovieAPiServer();

const regexForDublicate = /\*\s*\d{4}[-./]\d{2}[-./]\d{2}/; 
const keysOfDataListFilms: string[] = ['title', 'id', 'vote_average', 'release_date'];
const keysOfUlListFilms:string[] = ['title', 'id', 'vote_average', 'backdrop_path','poster_path']

const lang = computed<string>(() => featuresStore.getters.getLanguage);

const datalistChildren = ref<HTMLOptionsCollection>();
const event = ref<Event | CustomEvent>();
const input = ref<{inputFocus:Function }>();
const checkboxOne = ref(false);
const noTransformData = reactive<any[]>([]);
const noTransformDataForChoosenList = reactive<any[]>([]);
const activeFilmObject = reactive<any[]>([]);
const item = ref<any>();
const value = ref<string>('');
const focus = ref<boolean>(false);


const transformDataForDataList = computed<DatalistProp | {}[]>(() =>
 tranformObjectForLists(noTransformData,keysOfDataListFilms)
);

const setLangContent = () => getFormAddingFilmContent(lang.value);

const findFilm = throttle(() => {
  
    value.value = value.value.replace(regexForDublicate, '');

    if (value.value.trim().length > 0 && focus.value) {
      http
        .fetchMovieByQuery('1', value.value.trim())
        .then((e:[] | undefined) => {
          if (!e) {
            throw new Error("We didn't find anything");
           }
          noTransformData.length = 0;
          console.log(e, 'details');
          return e;
        })
        .then(e => noTransformData.push(...e))
        .catch(e => console.log(e)); // масив з списком фільмів
      // зробити так щоб похід за відео був тіки по обраному з дата листа
    }
  
}, 50);


onMounted(() => {
   event.value = new CustomEvent('option', {
    detail: { ...datalistChildren.value },
    bubbles: true,
    cancelable: true,
    composed: false
  });
});

const blurOnInput = (e: Event) => {
  focus.value = false;
  (e.target as HTMLInputElement).blur();

};

const addCustomUserFilm = (): void => { // функія додавання фільма без апі в тимчасовий массив
  activeFilmObject.splice(
    0, activeFilmObject.length, { title: value.value.trim(), id: generatorId('userFilm_') }
  )
};

const confirmSelectionByBlur = ():void=> Confirm.show(
'Confirmation of choice',
        `You have not selected any films from the proposed list. Your film name will be added without reference.
Click  "Yes"  to continue without binding and  "No"  to select from the list.`,
'Yes',
'No',
 addCustomUserFilm 
,
() => input?.value?.inputFocus(),
  { messageMaxLength: 181 });

const addFilmSelectionDependsOnKindOf = (regexTest: boolean,optionId:string): void => {
  regexTest ?
    activeFilmObject.splice(0, activeFilmObject.length, noTransformData.find(e => value.value.includes(e.release_date)))
    :
    activeFilmObject.splice(0, activeFilmObject.length, noTransformData.find(e => e.id === +optionId))
};

watch(focus, (n) => {  // розбить на функції
   
  if (!n && checkboxOne.value && value.value.trim().length > 0) {
    addCustomUserFilm();    
    return;
   }

  if (!n && !checkboxOne.value && value.value.trim().length > 0) {
    document.dispatchEvent(event.value as CustomEvent);
    const options:HTMLOptionsCollection = (event?.value as CustomEvent)?.detail?.datalistChildren;
    const optionId: string = Array.from(options).find(e => e.value === value.value)?.dataset?.id ?? '0';
    const regexTest = regexForDublicate.test(value.value);
    console.log(optionId);

    if (+optionId === 0 && !regexTest) {
      confirmSelectionByBlur();
    }
    else {
      addFilmSelectionDependsOnKindOf(regexTest,optionId);
      console.log(activeFilmObject, 'activ');
    }
  }
});
</script>

<style lang="scss" scoped>
form {
  border: 2px solid var(--text-color-light-orange);
  padding: 8px;
}

.input-conteiner {
  display: grid;
  margin-bottom: 12px;


  [for='addingFilm'] {
    margin-bottom: 4px;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  #addingFilm {
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
   
   &::-webkit-calendar-picker-indicator{
   display: none !important;
   } 
  }

  #addingFilm:hover,
  #addingFilm:focus {
    mix-blend-mode: hard-light;
  }
  #addingFilm:hover + input[type='button'],
  #addingFilm:focus + input[type='button'] {
    mix-blend-mode: hard-light;
  }

  input[type='button'] {
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

  input[type='button']:active {
    background: linear-gradient(
      0deg,
      rgb(255, 151, 0) 0%,
      rgb(251, 75, 2) 100%
    );
  }

  input[type='button'] + div {
    grid-area: 3;
  }

  input[type='button'] + div {
    grid-area: 3;
  }

  & + p {
    text-align: center;
  }

}


:deep(button) {
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
  color: var(--base-text-theme);
  padding-left: 15px;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
  font-size: 16px;
}
</style>
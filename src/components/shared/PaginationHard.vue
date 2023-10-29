<template>
  <div class="pagination" :proppages="proppages">
    <button
      class="arrow pagination__button"
      v-if="page > 1"
      type="button"
      @click.stop="pageMinus"
    >
      &lsaquo;
    </button>
    <ul class="pagination__list">
      <li v-for="(p, i) of arrPage.template" :key="i">
        <button
          v-on:click.stop="setPage"
          ref="point"
          class="pagination__button"
          :class="{ active: +p === page }"
          v-bind="
            p === '...' && checkSupport()
              ? { popovertarget: 'pagination-popover' }
              : {}
          "
        >
          {{ p }}
        </button>
      </li>
    </ul>
    <button
      class="arrow pagination__button"
      v-if="page !== +serverDate.template.slice(-1)[0]"
      @click.stop="pagePlus"
      type="button"
    >
      &rsaquo;
    </button>
    <ModalExperementalVue
      v-if="checkSupport()"
      @forcePage="setPage"
      :max="proppages"
    />
  </div>
</template>

<script lang="ts" setup>
import Bowser from 'bowser';
import ModalExperementalVue from './ModalExperemental.vue'; // popover api on this moment 23.07.2023 only chrome ande edge
import { reactive, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ proppages: number, path: string }>(),
  {
    proppages: () => 0,
    path: () => ''
  });
  
const page = ref(1);
const arrPage = reactive({template:['1', '2', '3', '4', '5', '6', '...', props.proppages.toString()]});
const serverDate = reactive < { template: number[] | string [] }>({template:[]});
const browser = ref(Bowser.getParser(window.navigator.userAgent)
  .getBrowserName()
  .toLowerCase());
  
    //описую передану функцію
const emit = defineEmits<{ numPage: [page: number] }>();

const controlStorage = () => {
  if (
    JSON.parse(window.localStorage.getItem('numberPage') as string) &&
    JSON.parse(window.localStorage.getItem('filmsPage') as string)
  ) {
    return props.path === 'Home'
      ? +JSON.parse(window.localStorage.getItem('numberPage') as string)
      : 1;
  }

  return 1;
};

const setServ = () => {
  //формування форми пагінації
  const serverDateGen = [...Array(props.proppages + 1).keys()].filter(
    e => e > 0
  ).map(e => typeof e !== 'number' ?e: e.toString());
   
  return (serverDate.template = serverDateGen);
};

const lessPage = () => arrPage.template = [...serverDate.template].map(e => typeof e !== 'number' ?e: e.toString());

const setPagination = () => {
  //базовий вид [доопрацювати не готово]
  arrPage.template = [
    ...serverDate.template.slice(0, 6),
    '...',
    serverDate.template[serverDate.template.length -1],
  ].map(e => typeof e !== 'number' ? e : e.toString());
 
};

  const created = ()=> {
    //те що мені потрібно одразу до рендера дома
    page.value = controlStorage(); //
    setServ();
    if (+props.proppages <= 6) {
      return lessPage();
    }
    setPagination();
};

created();

const checkSupport = () => {
  // перевіряю користувацбкий браузер
  const browsVers = +Bowser.getParser(window.navigator.userAgent)
    .getBrowserVersion()
    .split('.')[0];
  if (browser.value.includes('opera') && browsVers >= 100) {
    return true;
  };
  return (
    (browser.value.includes('chrome') || browser.value.includes('edge')) &&
    browsVers >= 114
  );
};
    
const forcePage = (n:number) => {
  //функція відповідає за синхронність сторінок внизу і зверху //реф
  page.value = n;
};

defineExpose({forcePage});

const setPage = (e: Event | number) => {
  //клік по кнопкам
  const choose = typeof e !== 'number' && 'target' in e && (e?.target as HTMLButtonElement).textContent;
  
  if (choose && !isNaN(+choose)) {
    page.value = +choose;
    emit('numPage', page.value); //передаю наверх для запиту
    return;
  } else if (typeof e === 'number') {
    // вказує на прихід сторінки з інпута модалки
    page.value = e;
    emit('numPage', page.value); //передаю наверх для запиту
  }
  
  return;
};

const pagePlus = () => {
  //кнопка права
  page.value++;
  emit('numPage', page.value);
};

const pageMinus = () => {
  //кнопка ліва
  page.value--;
  emit('numPage', page.value);
};

const mutateArr = () => {
  // мутація великої кількості схов
  const fillNum = [];

  fillNum.push(
    page.value + 1,
    page.value + 2,
    page.value - 1,
    page.value - 2,
    page.value
  );

  return (arrPage.template = [
    serverDate.template[0].toString(),
    '...',
    ...fillNum.sort((a, b) => a - b),
    '...',
    serverDate.template[serverDate.template.length - 1],
  ].map(e => typeof e !== 'number' ?e: e.toString()));
};

  const noMutateArr = ()=>
      // постійна паг мало сторінкова **можливе добавленя перевірки**
      (arrPage.template = [
        serverDate.template[0],
        ...[...Array(7).keys()].filter(e => e > 1),
        '...',
        `${serverDate.template[serverDate.template.length - 1]}`,
      ].map(e=> e.toString()));
    
const maxArr = () =>
//кінцевий вид
(arrPage.template = [
  serverDate.template[0],
  '...',
  ...serverDate.template.slice(serverDate.template.length - 5),
].map(e => typeof e !== 'number' ?e: e.toLocaleString()));
    
//контроль змін сторінки
watch(page, () => {
  
  if (props.proppages <= 6) {
    
    return lessPage();
  }
  if (page.value >= 6 && page.value <= +serverDate.template[serverDate.template.length - 5]) {
    
    return mutateArr();
  }
  if (page.value < 6) {
    
    return noMutateArr();
  }
  if (page.value >= +arrPage.template[arrPage.template.length - 5]) {
   
    return maxArr();
  }
});

</script>

<style lang="scss" scoped>
.pagination-wrap {
  position: relative;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 1px;
}
.pagination__list {
  display: flex;
  gap: 2px;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  // max-width:374px;
  @media screen and (max-width: 767.5px) {
    width: 100%;
  }
}
.pagination__button {
  border-radius: 5px;
  border: 0px;
  background-color: var(--pagination-transparent-bg, var(--text-color-light));
  color: var(--text-color-light-grey);
  cursor: pointer;
  padding: 3px;
  min-width: 30px;
}

.pagination__button:hover {
  color: var(--text-color-black);

  text-shadow: 0px 1px 2px #000;
}

.active {
  width: 40px;
  height: 40px;

  pointer-events: none;
  background-color: var(--text-color-light-orange);
  color: var(--text-color-light);
  @media screen and (max-width: 390px) {
    width: 30px;
  }
}
.arrow {
  width: 40px;
  height: 40px;
  background-color: var(
    --pagination-transparent-bg,
    var(--bg-color-light-grey)
  );
  border: var(--pagination-border, none);
  &:active {
    background-color: var(--text-color-light-orange);
    color: var(--text-color-light);
  }
  @media screen and (max-width: 420px) {
    width: 30px;
    // flex-basis: 30px;
  }
}
.no-active {
  pointer-events: none;
  color: var(--text-color-light-grey);
}
</style>

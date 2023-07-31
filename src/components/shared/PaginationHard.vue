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
      <li v-for="(p, i) of arrPage" :key="i">
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
      v-if="page !== serverDate.at(-1)"
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

<script>
import Bowser from 'bowser';
import ModalExperementalVue from './ModalExperemental.vue'; // popover api on this moment 23.07.2023 only chrome ande edge

export default {
  name: 'PaginationHard',
  components: { ModalExperementalVue },
  props: {
    proppages: {
      type: Number,
      required: true,
      default: 0,
    },
    path: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      page: 1,
      arrPage: ['1', '2', '3', '4', '5', '6', '...', this.proppages],
      serverDate: [],
      target: 1,
      browser: Bowser.getParser(window.navigator.userAgent)
        .getBrowserName()
        .toLowerCase(),
    };
  },
  emits: {
    //описую передану функцію
    numPage: value => typeof value === 'number' && value > 0,
  },
  methods: {
    checkSupport() {
      // перевіряю користувацбкий браузер
      const browsVers = +Bowser.getParser(window.navigator.userAgent)
        .getBrowserVersion()
        .split('.')[0];
      return (
        (this.browser.includes('chrome') || this.browser.includes('edge')) &&
        browsVers >= 114
      );
    },

    setServ() {
      //формування форми пагінації
      const serverDate = [...Array(this.proppages + 1).keys()].filter(
        e => e > 0
      );

      return (this.serverDate = serverDate);
    },
    forcePage(n) {
      //функція відповідає за синхронність сторінок внизу і зверху //реф
      this.page = n;
    },
    setPage(e) {
      //клік по кнопкам
      this.target = e?.target;
      const choose = +e?.target?.textContent;

      if (choose) {
        this.page = choose;
        this.$emit('numPage', this.page); //передаю наверх для запиту
        return;
      } else if (typeof e === 'number') {
        // вказує на прихід сторінки з інпута модалки
        this.page = e;
        this.$emit('numPage', this.page); //передаю наверх для запиту
      }

      return;
    },
    pagePlus() {
      //кнопка права
      this.page++;
      this.$emit('numPage', this.page);
    },
    pageMinus() {
      //кнопка ліва
      this.page--;
      this.$emit('numPage', this.page);
    },
    setPagination() {
      //базовий вид [доопрацювати не готово]
      this.arrPage = [
        ...this.serverDate.slice(0, 6),
        '...',
        this.serverDate.at(-1),
      ];
    },
    mutateArr() {
      // мутація великої кількості схов
      const fillNum = [];

      fillNum.push(
        this.page + 1,
        this.page + 2,
        this.page - 1,
        this.page - 2,
        this.page
      );

      return (this.arrPage = [
        this.serverDate[0],
        '...',
        ...fillNum.sort((a, b) => a - b),
        '...',
        this.serverDate.at(-1),
      ]);
    },
    noMutateArr() {
      // постійна паг мало сторінкова **можливе добавленя перевірки**

      return (this.arrPage = [
        this.serverDate[0],
        ...[...Array(7).keys()].filter(e => e > 1),
        '...',
        `${this.serverDate.at(-1)}`,
      ]);
    },
    maxArr() {
      //кінцевий вид
      this.arrPage = [
        this.serverDate[0],
        '...',
        ...this.serverDate.slice(this.serverDate.length - 5),
      ];
    },
    lessPage() {
      this.arrPage = [...this.serverDate];
    },
    controlStorage() {
      if (
        JSON.parse(window.localStorage.getItem('numberPage')) &&
        JSON.parse(window.localStorage.getItem('filmsPage'))
      ) {
        return this.path === 'Home'
          ? JSON.parse(window.localStorage.getItem('numberPage'))
          : 1;
      }

      return 1;
    },
  },
  watch: {
    //контроль змін сторінки
    page() {
      if (+this.proppages <= 6) {
        return this.lessPage();
      }
      if (this.page >= 6 && this.page <= this.serverDate.at(-5)) {
        return this.mutateArr();
      }
      if (this.page < 6) {
        return this.noMutateArr();
      }
      if (this.page >= this.arrPage.at(-5)) {
        return this.maxArr();
      }
    },
  },
  async created() {
    //те що мені потрібно одразу до рендера дома
    this.page = this.controlStorage(); //
    this.setServ();
    if (+this.proppages <= 6) {
      return this.lessPage();
    }
    this.setPagination();
  },
};
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

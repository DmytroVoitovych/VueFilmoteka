<template>
  <CollapsibleRoot v-model:open="open">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <span class="Text">Всього додано:{{ ` ${props.films.length}` }}</span>
      <CollapsibleTrigger class="IconButton">
        <Icon v-if="open" icon="carbon:row-collapse" />
        <Icon v-else icon="carbon:row-expand" />
      </CollapsibleTrigger>
    </div>
    <ul class="searchList">
      <li class="searchList__commonStyle">
        <p class="searchList__title">
          <span>Title: </span> {{ (visibleLi as UllistProp)?.title}}
        </p>
        <span class="searchList__rate"
          ><span>Rate: </span>
          {{ (visibleLi as UllistProp)?.vote_average?.toFixed(1) ?? 0 }}</span
        >

        <img
          class="searchList__img"
          :src=" getPoster((visibleLi as UllistProp)?.backdrop_path! ?? (visibleLi as UllistProp)?.poster_path! ) "
          :alt="(visibleLi as UllistProp)?.title ?? 'no image'"
        />
      </li>
      <CollapsibleContent as="li" class="CollapsibleContent searchList__item">
        <TransitionGroup tag="ul" name="list">
          <li
            class="searchList__commonStyle"
            v-for="{title , id, vote_average, backdrop_path, poster_path } of (hiddedLi as UllistProp[])"
            :key="id"
          >
            <p class="searchList__title"><span>Title: </span> {{ title }}</p>
            <span class="searchList__rate"
              ><span>Rate: </span> {{ vote_average?.toFixed(1) ?? 0 }}</span
            >

            <img
              class="searchList__img"
              :src=" getPoster(backdrop_path! ?? poster_path!) "
              :alt="title ?? 'no image'"
            />
          </li>
        </TransitionGroup>
      </CollapsibleContent>
    </ul>
  </CollapsibleRoot>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UllistProp } from "./localType";
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "radix-vue";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { TransitionGroup, Transition } from "vue";
import img from "@/assets/images/ded.jpg";

const props = defineProps<{
  films: UllistProp[] | {}[];
}>();

const open = ref<boolean>(false);
const visibleLi = computed<UllistProp | {}>(() => props.films[0]);
const hiddedLi = computed<UllistProp[] | {}[]>(() => props.films.filter((_, i) => i));

const getPoster = (poster: string | null) =>
  poster
    ? //постери
      `https://image.tmdb.org/t/p/w300/${poster}`
    : img;
</script>

<style lang="scss" scoped>
$listColumnGap: 8px;

.searchList {
  position: absolute;
  background-color: var(--base-background-theme);
  top: 100%;
  left: 0;
  right: 0;
  padding: 8px;
  outline: 2px solid var(--text-color-light-orange);
  z-index: 2;

  &__img {
    width: 100%;
    height: 56px;
    border-radius: 5px;
    grid-row: 1/3;
    grid-column: 2;
  }

  &__title {
    margin-bottom: 8px;
  }

  &__title > span,
  &__rate > span {
    background-color: var(--bg-color-modal-orange);
    border-radius: 5px;
    padding: 4px;
    margin-right: 4px;
  }

  &__commonStyle {
    display: grid;
    grid-template-columns: calc(80% - $listColumnGap) 20%;
    grid-template-rows: 0fr;
    backdrop-filter: contrast(0.7);
    padding: 8px;
    border-radius: 5px;
    column-gap: $listColumnGap;
  }

  &:not(:first-child) > li .searchList__commonStyle {
    margin-top: 8px;
  }
}

.CollapsibleContent {
  overflow: hidden;
}

.CollapsibleContent[data-state="open"] {
  animation: slideDown 300ms ease-out;
}
.CollapsibleContent[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}

@keyframes slideDown {
  from {
    height: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
  }
}

@keyframes slideUp {
  from {
    height: var(--radix-collapsible-content-height);
  }
  to {
    height: 0;
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-out;
}
.list-enter-from,
.list-leave-to {
  opacity: 1;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}
/* .searchList__item *  {
opacity: 1;  
animation: menuAppears 300ms ease;
}

@keyframes menuAppears {
  from {
    translate:-30px 0;
    opacity: 0;
  }
  to {
    translate:0 0;
    opacity: 1;
  }
} */

@keyframes menuDisappears {
  from {
    display: block;
    translate: 0 0;
    opacity: 1;
  }
  to {
    translate: -30px 0;
    opacity: 0;
  }
}
</style>

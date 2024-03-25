//tasks 1. передає один з трьох режимів рандому 2.локалсторедж приймає час обертів колеса

<template>
  <form
    @keypress.enter="$event.preventDefault()"
    name="modeSelection"
    oninput="seconds.value=timerSec.value"
  >
    <fieldset>
      <legend>{{ setLangContent()[0] }}</legend>
      <RadioGroupRoot
        v-model="radioStateSingle"
        class="RadioGroupRoot"
        default-value="default"
        aria-label="View density"
      >
        <div>
          <RadioGroupItem id="standartRadio" class="RadioGroupItem" value="standart">
            <RadioGroupIndicator class="RadioGroupIndicator" />
          </RadioGroupItem>
          <label class="Label" for="standartRadio">
            {{ setLangContent()[1] }}
          </label>
        </div>
        <div>
          <RadioGroupItem id="takeOff" class="RadioGroupItem" value="takeoff">
            <RadioGroupIndicator class="RadioGroupIndicator" />
          </RadioGroupItem>
          <label class="Label" for="takeOff">
            {{ setLangContent()[2] }}
          </label>
        </div>
        <div>
          <RadioGroupItem id="battle" class="RadioGroupItem" value="battle">
            <RadioGroupIndicator class="RadioGroupIndicator" />
          </RadioGroupItem>
          <label class="Label" for="battle">
            {{ setLangContent()[3] }}
          </label>
        </div>
      </RadioGroupRoot>
      <div class="timerSelection">
        <InputComponent
          id="timerSec"
          name="timerSec"
          class="Input"
          type="number"
          :value="inputDuration"
          min="10"
          max="60"
          v-model:find="inputDuration"
        />
        <Label class="LabelRoot" for="timerSec"
          >{{ setLangContent()[4] }}:&#32;<output name="seconds" for="timerSec">10</output
          >{{ setLangContent()[5] }}</Label
        >
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot, Label } from "radix-vue";
import { ref, watch, getCurrentInstance, computed, provide } from "vue";
import InputComponent from "../header/InputComponent.vue";
import { featuresStore } from "@/store/storeForFeatures";
import { getSelectionContent } from "./contentLang";

const radioStateSingle = ref<"standard" | "takeoff" | "battle">("standard");
const inputDuration = ref<string>("10");
const lang = computed<string>(() => featuresStore.getters.getLanguage);

const setLangContent = () => getSelectionContent(lang.value);

watch(radioStateSingle, () => emit("moode", radioStateSingle.value));
watch(inputDuration, () => {
  emit("duration", inputDuration.value);
  console.log(inputDuration.value, "input");
});

const emit = defineEmits<{
  moode: [radioStateSingle: "standard" | "takeoff" | "battle"];
  duration: [inputDuration: string];
}>();

console.log(inputDuration, "inputDuration");
</script>

<style lang="scss" scoped>
legend {
  padding: 0 10px;
}

/* reset */
button {
  all: unset;
}

fieldset {
  border-color: var(--text-color-light-orange);
}

.RadioGroupRoot {
  display: flex;
  gap: 10px;

  > div {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 8px;
  }
}

.RadioGroupItem {
  background-color: var(--bg-color-light-white);
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 2px 10px var(--form-mood-sbox-shadow);
  cursor: pointer;
}
.RadioGroupItem:hover {
  background-color: var(--form-mood-selection);
}
.RadioGroupItem:focus {
  box-shadow: 0 0 0 2px var(--text-color-light-orange);
}

.RadioGroupIndicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.RadioGroupIndicator::after {
  content: "";
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: var(--bordo-background);
}

.Label {
  color: var(--base-text-theme);
  font-size: 15px;
  line-height: 1;
}

.timerSelection {
  display: inline-block;
  margin-top: 8px;

  #timerSec {
    max-width: 42px;
    background-color: inherit;
    border: 0.5px;
    outline: none;
    border-bottom: 0.5px solid var(--text-color-light-orange);
    margin-right: 8px;
    color: var(--base-text-theme);
  }
}

.LabelRoot {
  font-size: 14px;
  color: inherit;
}
</style>

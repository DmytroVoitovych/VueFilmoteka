//tasks 
1. передає один з трьох режимів рандому
2.локалсторедж приймає час обертів колеса

<template>
<form action="" name="modeSelection"> 
<fieldset>
<legend>Вибір способу відбору</legend>
  <RadioGroupRoot
    v-model="radioStateSingle" class="RadioGroupRoot" default-value="default"
    aria-label="View density"
  >
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <RadioGroupItem
        id="r1"
        class="RadioGroupItem" value="default"
      >
        <RadioGroupIndicator
          class="RadioGroupIndicator"
        />
      </RadioGroupItem>
      <label class="Label" for="r1">
        Default
      </label>
    </div>
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <RadioGroupItem
        id="r2"
        class="RadioGroupItem" value="comfortable"
      >
        <RadioGroupIndicator
          class="RadioGroupIndicator"
        />
      </RadioGroupItem>
      <label class="Label" for="r2">
        Comfortable
      </label>
    </div>
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <RadioGroupItem
        id="r3"
        class="RadioGroupItem" value="compact"
      >
        <RadioGroupIndicator
          class="RadioGroupIndicator"
        />
      </RadioGroupItem>
      <label class="Label" for="r3">
        Compact
      </label>
    </div>
  </RadioGroupRoot>
  <div :style="{ display: 'flex', padding: '0 20px', flexWrap: 'wrap', gap: 15, alignItems: 'center' }">
    <Label class="LabelRoot" for="firstName"> First name </Label>
    <InputComponent
      id="firstName"
      class="Input"
      type="text"
      value="Pedro Duarte"
    />
  </div>
 </fieldset>
</form>
</template>

<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot,Label } from 'radix-vue';
import { ref, watch } from 'vue';
import InputComponent from '../header/InputComponent.vue';


const radioStateSingle = ref('default');

watch(radioStateSingle, (n)=>console.log(n));

console.log(radioStateSingle,'radioStateSingle');
</script>

<style lang="scss" scoped>


/* reset */
button {
  all: unset;
}

.RadioGroupRoot {
  display: flex;
  gap: 10px;
}

.RadioGroupItem {
  background-color: white;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 2px 10px #2d2a2a;
}
.RadioGroupItem:hover {
  background-color: var(--modal-grey);
}
.RadioGroupItem:focus {
  box-shadow: 0 0 0 2px black;
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
  content: '';
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: var(--bordo-background);
}

.Label {
  color: white;
  font-size: 15px;
  line-height: 1;
  padding-left: 15px;
}

</style>
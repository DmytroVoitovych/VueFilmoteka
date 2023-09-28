import { inject, type ComputedRef } from 'vue';
import type { VueCookies } from 'vue-cookies';

export type langT = ComputedRef<string> | string; // залежить від vuex гетера

export const $cookies = inject<VueCookies>('$cookies'); // для глобального користування

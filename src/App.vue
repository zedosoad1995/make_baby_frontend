<script setup lang="ts">
import { Button } from 'primevue'
import { createBaby } from './api/baby'
import { computed, ref } from 'vue'
import type { ICreateBabyRes } from './types/baby'
import BabiesSeenTodayList from './components/BabiesSeenTodayList.vue'

interface BabiesSeenTodayListRef {
  addNewBabyRef: (country: string, rarity: string, flagFile: string) => void
}

const childRef = ref<BabiesSeenTodayListRef | null>(null)
const isFetchingBaby = ref(false)
const baby = ref<ICreateBabyRes | null>(null)
const flagUrl = computed(() => import.meta.env.VITE_ASSETS_URL + '/' + baby.value?.flag_file)

const generateNewBaby = async () => {
  isFetchingBaby.value = true
  await createBaby()
    .then((res) => (baby.value = res))
    .finally(() => (isFetchingBaby.value = false))

  if (childRef.value && baby.value) {
    childRef.value.addNewBabyRef(
      baby.value.country,
      baby.value.rarity,
      import.meta.env.VITE_ASSETS_URL + '/' + baby.value?.flag_file,
    )
  }
}
</script>

<template>
  <div class="root">
    <BabiesSeenTodayList ref="childRef"></BabiesSeenTodayList>
    <p v-show="baby !== null">{{ baby?.country }}</p>
    <div class="flag-box" v-show="baby !== null">
      <img class="flag" :src="flagUrl" alt="Flag" />
    </div>
    <Button class="button" @click="generateNewBaby" :loading="isFetchingBaby">New Baby</Button>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.flag-box {
  height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag {
  max-width: 100%;
  max-height: 100%;
}

.button {
  margin-top: 16px;
}
</style>

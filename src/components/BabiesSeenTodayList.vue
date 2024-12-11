<script setup lang="ts">
import { Card, ScrollPanel } from 'primevue'
import { ref, watch } from 'vue'
import debounce from 'lodash.debounce'

const sortedBabies = ref<{ country: string; number: number; lastAdded: Date }[]>([])
const babies = ref<Record<string, { number: number; lastAdded: Date }>>({})

const addNewBabyRef = (country: string) => {
  babies.value[country] = {
    number: (babies.value[country]?.number ?? 0) + 1,
    lastAdded: new Date(),
  }
}

defineExpose({
  addNewBabyRef,
})

const debouncedSort = debounce(() => {
  sortedBabies.value = Object.entries(babies.value)
    .map(([country, { lastAdded, number }]) => ({ country, number, lastAdded }))
    .sort((a, b) => {
      const sortNum = a.number - b.number
      if (sortNum !== 0) return sortNum

      return b.lastAdded.getTime() - a.lastAdded.getTime()
    })
})

console.log(sortedBabies.value)

watch(babies, debouncedSort, { deep: true })
</script>

<template>
  <Card class="babyOfTheDayCard">
    <template #title>Babies Seen Today</template>
    <template #content>
      <ScrollPanel class="scrollPanel">
        <ul>
          <li v-for="baby in sortedBabies" :key="baby.country">
            {{ baby.country }}: {{ baby.number }}
          </li>
        </ul>
      </ScrollPanel>
    </template>
  </Card>
</template>

<style scoped>
.babyOfTheDayCard {
  width: 100%;
}

.scrollPanel {
  width: 100%;
  height: 200px;
}
</style>

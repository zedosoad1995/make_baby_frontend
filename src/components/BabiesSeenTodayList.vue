<script setup lang="ts">
import { Panel, ScrollPanel } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import debounce from 'lodash.debounce'
import { getRarityInfo } from '@/api/baby'

const rarities = ref<string[]>([])
const numCountriesByRarity = ref<Record<string, number>>({})
const sortedBabies = ref<{ country: string; number: number; lastAdded: Date; rarity: string }[]>([])
const sortedBabies2 = ref<
  Record<
    string,
    {
      country: string
      number: number
      flagFile: string
    }[]
  >
>({})
const babies = ref<
  Record<string, { number: number; lastAdded: Date; rarity: string; flagFile: string }>
>({})

onMounted(async () => {
  const { labels, num_countries_by_rarity } = await getRarityInfo()
  rarities.value = labels.reverse()
  numCountriesByRarity.value = num_countries_by_rarity
})

const addNewBabyRef = (country: string, rarity: string, flagFile: string) => {
  babies.value[country] = {
    number: (babies.value[country]?.number ?? 0) + 1,
    lastAdded: new Date(),
    rarity,
    flagFile,
  }
}

defineExpose({
  addNewBabyRef,
})

const debouncedSort = debounce(() => {
  sortedBabies.value = Object.entries(babies.value)
    .map(([country, { lastAdded, number, rarity }]) => ({ country, number, lastAdded, rarity }))
    .sort((a, b) => {
      const sortNum = a.number - b.number
      if (sortNum !== 0) return sortNum

      return b.lastAdded.getTime() - a.lastAdded.getTime()
    })
})

const debouncedSort2 = debounce(() => {
  const unsorted = Object.entries(babies.value).reduce(
    (acc, [country, { number, rarity, flagFile }]) => {
      if (!acc[rarity]) {
        acc[rarity] = []
      }
      acc[rarity].push({ country, number, flagFile })

      return acc
    },
    {} as Record<string, { country: string; number: number; flagFile: string }[]>,
  )

  sortedBabies2.value = Object.fromEntries(
    Object.entries(unsorted)
      .map(([rarity, countries]) => {
        return [rarity, countries.slice().sort((a, b) => b.number - a.number)] as const
      })
      .sort((a, b) => a[1][0].number - b[1][0].number),
  )
})

const seenRarities = computed(() => rarities.value.filter((r) => r in sortedBabies2.value))

watch(babies, debouncedSort, { deep: true })
watch(babies, debouncedSort2, { deep: true })
</script>

<template>
  <Panel header="Babies Seen Today" class="babyOfTheDayCard">
    <ScrollPanel class="scrollPanel">
      <!-- <ul>
        <li v-for="baby in sortedBabies" :key="baby.country">
          {{ baby.country }}: {{ baby.number }} ({{ baby.rarity }})
        </li>
      </ul> -->
      <template v-for="rarity in seenRarities" :key="rarity">
        <h2>
          {{ rarity }} ({{ sortedBabies2[rarity].length }}/{{ numCountriesByRarity[rarity] }})
        </h2>
        <div class="rarityCountriesBox">
          <div v-for="baby in sortedBabies2[rarity]" :key="baby.country" class="countryGroup">
            <div class="flag" tabindex="1" v-tooltip.focus.top="baby.country" v-focus-hover>
              <img :src="baby.flagFile" alt="Small flag" height="16px" />
            </div>
            <div>{{ baby.number }}</div>
          </div>
        </div>
      </template>
    </ScrollPanel>
  </Panel>
</template>

<style scoped>
.babyOfTheDayCard {
  width: 100%;
}

.scrollPanel {
  width: 100%;
  height: 200px;
}

.rarityCountriesBox {
  display: flex;
  gap: 8px;
}

.countryGroup {
  display: flex;
  gap: 4px;
}

.flag {
  height: 16px;
}
</style>

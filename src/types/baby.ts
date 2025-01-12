export interface IRarityInfo {
  labels: string[]
  num_countries_by_rarity: Record<string, number>
}

export interface ICreateBabyRes {
  country: string
  prob: number
  flag_file: string
  rarity: string
}

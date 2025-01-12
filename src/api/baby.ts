import type { ICreateBabyRes, IRarityInfo } from '@/types/baby'
import api from './api'

export const getRarityInfo = (): Promise<IRarityInfo> => {
  return api.get('/babies/rarity-info')
}

export const createBaby = (): Promise<ICreateBabyRes> => {
  return api.post('/babies')
}

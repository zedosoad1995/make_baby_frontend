import type { ICreateBabyRes } from '@/types/baby'
import api from './api'

export const createBaby = (): Promise<ICreateBabyRes> => {
  return api.post('/babies')
}

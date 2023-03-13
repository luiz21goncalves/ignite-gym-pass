export type Gym = {
  id: string
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export type CreateGymData = {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export type GymsRepository = {
  create(date: CreateGymData): Promise<Gym>
  findById(id: string): Promise<Gym | null>
}

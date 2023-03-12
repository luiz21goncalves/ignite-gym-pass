export type CheckInData = {
  user_id: string
  gym_id: string
}

export type CheckIn = {
  id: string
  user_id: string
  gym_id: string
  created_at: Date
  validated_at: Date | null
}

export type CheckInsRepository = {
  create(data: CheckInData): Promise<CheckIn>
}

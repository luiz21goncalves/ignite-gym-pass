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
  save(data: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findById(id: string): Promise<CheckIn | null>
  countUserId(userId: string): Promise<number>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
}

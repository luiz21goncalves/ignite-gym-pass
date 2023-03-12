export type CreateUserData = {
  name: string
  email: string
  password_hash: string
}

export type User = {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date
}

export type UsersRepository = {
  create(data: CreateUserData): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

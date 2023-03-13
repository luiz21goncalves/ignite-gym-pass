import { randomUUID } from 'node:crypto'

import { CreateUserData, User, UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[]

  constructor() {
    this.users = []
  }

  public async create({
    email,
    name,
    password_hash,
  }: CreateUserData): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)

    return user ?? null
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    return user ?? null
  }
}

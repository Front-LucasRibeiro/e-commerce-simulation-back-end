import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import AccessToken from './access_token.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare full_name: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Definição da relação com AccessToken
  @hasMany(() => AccessToken, {
    foreignKey: 'userId', // Ajuste conforme seu modelo AccessToken
  })
  declare accessTokens: HasMany<typeof AccessToken>
}

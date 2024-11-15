import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import CartItem from './cart_item.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column()
  public totalPrice: number = 0 // Preço total dos itens no carrinho

  @column()
  public status: string = 'active' // Status do carrinho (ativo, finalizado)

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasMany(() => CartItem)
  public items!: relations.HasMany<typeof CartItem>
}

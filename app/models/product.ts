import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public skuId!: number

  @column()
  public name!: string

  @column()
  public alt!: string

  @column()
  public image!: string

  @column()
  public price!: number

  @column()
  public stock: number = 0

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Product from './product.js'
import Cart from './cart.js'
import * as relations from '@adonisjs/lucid/types/relations'


export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public cartId!: number // Referência ao carrinho

  @column()
  public productId!: number // Referência ao produto

  @column()
  public quantity!: number // Quantidade do produto

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  // A relação 'product' agora é obrigatória
  @belongsTo(() => Product)
  public product!: relations.BelongsTo<typeof Product>

  @belongsTo(() => Cart)
  public cart!: relations.BelongsTo<typeof Cart>
}

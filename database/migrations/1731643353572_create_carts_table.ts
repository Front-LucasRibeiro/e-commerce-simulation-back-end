import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CartSchema extends BaseSchema {
  protected tableName = 'carts'

  public async up() {
    // Criar tabela de carrinhos
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // ID do carrinho
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Referência ao usuário
      table.decimal('total_price', 12, 2).defaultTo(0.00) // Preço total dos itens no carrinho
      table.timestamp('created_at') // Data de criação
      table.timestamp('updated_at') // Data de atualização
    })

    // Criar tabela de itens do carrinho
    this.schema.createTable('cart_items', (table) => {
      table.increments('id') // ID do item
      table.integer('cart_id').unsigned().references('id').inTable(this.tableName).onDelete('CASCADE') // Referência ao carrinho
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE') // Referência ao produto
      table.integer('quantity').defaultTo(1) // Quantidade do produto
      table.timestamp('created_at') // Data de criação
      table.timestamp('updated_at') // Data de atualização
    })
  }

  public async down() {
    // Remover tabela de itens do carrinho primeiro
    this.schema.dropTable('cart_items')
    // Remover tabela de carrinhos
    this.schema.dropTable(this.tableName)
  }
}

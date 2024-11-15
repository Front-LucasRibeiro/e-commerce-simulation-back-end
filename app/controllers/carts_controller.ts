import Cart from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartController {
  public async createCart({ request, response }: HttpContext) {
    const { userId, totalPrice, status, items } = request.only([
      'userId',
      'totalPrice',
      'status',
      'items',
    ])

    // Cria o carrinho, associando os itens diretamente no momento da criação
    const cart = await Cart.create({
      userId,
      totalPrice,
      status,
    })

    // Adiciona os itens ao carrinho
    await cart.related('items').createMany(items)

    return response.status(201).json(cart) // Retorna o carrinho criado
  }

  public async addItems({ params, request, response }: HttpContext) {
    const cartId = params.id // ID do carrinho a ser atualizado
    const items = request.input('items') // Itens a serem adicionados

    // Encontre o carrinho pelo ID
    const cart = await Cart.findOrFail(cartId)

    // Adicione os novos itens ao carrinho
    await cart.related('items').createMany(items)

    return response.status(200).json(cart) // Retorna o carrinho atualizado
  }

  // Método para obter todos os itens do carrinho de um usuário
  public async getItems({ params, response }: HttpContext) {
    const carts = await Cart.query()
      .where('userId', params.userId)
      .preload('items', (itemQuery) => {
        itemQuery.preload('product') // Precarrega os dados do produto
      })

    return response.status(200).json(carts) // Retorna todos os carrinhos com os itens
  }

  // Método para remover um item do carrinho
  public async removeItemCart({ params, response }: HttpContext) {
    const cart = await Cart.findOrFail(params.id)

    await cart.delete() // Remove o item do carrinho

    return response.status(204) // Retorna status 204 sem conteúdo
  }
}

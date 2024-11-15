import Cart from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'


export default class CartController {
  public async createCart({ request, response }: HttpContext) {
    const { userId, totalPrice, status, items } = request.only([
      'userId',
      'totalPrice',
      'status',
      'items'
    ])

    // Cria o carrinho, associando os itens diretamente no momento da criação
    const cart = await Cart.create({
      userId,
      totalPrice,
      status,
      items, // Supondo que 'items' seja um array de objetos CartItem
    })

    return response.status(201).json(cart) // Retorna o carrinho criado
  }

  // Método para obter todos os itens do carrinho de um usuário
  public async getItems({ params, response }: HttpContext) {
    const carts = await Cart.query().where('userId', params.userId)

    return response.status(200).json(carts) // Retorna todos os itens do carrinho
  }

  // Método para remover um item do carrinho
  public async removeItemCart({ params, response }: HttpContext) {
    const cart = await Cart.findOrFail(params.id)

    await cart.delete() // Remove o item do carrinho

    return response.status(204) // Retorna status 204 sem conteúdo
  }
}

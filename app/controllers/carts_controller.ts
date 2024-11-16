import Cart from '#models/cart'
import CartItem from '#models/cart_item'
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
    const items = request.input('items') // Itens a serem atualizados

    const cart = await Cart.findOrFail(cartId)

    for (const item of items) {
      const existingItem = await cart
        .related('items')
        .query()
        .where('productId', item.productId)
        .first()

      if (existingItem) {
        // Atualiza a quantidade do item existente
        existingItem.quantity += item.quantity // Ajuste conforme necessário
        await existingItem.save()
      } else {
        // Adiciona novo item se não existir
        await cart.related('items').create({
          productId: item.productId,
          quantity: item.quantity,
        })
      }
    }

    return response.status(200).json(cart) // Retorna o carrinho atualizado
  }

  // Novo método para atualizar a quantidade de um item no carrinho
  public async updateItemQuantity({ params, request, response }: HttpContext) {
    const cartId = params.id // ID do carrinho
    const { productId, quantity } = request.only(['productId', 'quantity']) // Dados recebidos para atualização

    const cart = await Cart.findOrFail(cartId)
    const existingItem = await cart.related('items').query().where('productId', productId).first()

    if (existingItem) {
      // Atualiza a quantidade do item existente
      existingItem.quantity = quantity // Ou use existingItem.quantity += quantity para incrementar
      await existingItem.save()
      return response.status(200).json(existingItem) // Retorna o item atualizado
    } else {
      return response.status(404).json({ message: 'Item não encontrado no carrinho.' })
    }
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

  public async removeItemCart({ params, response }: HttpContext) {
    const cartId = params.cartId
    const itemId = params.itemId

    // Verifica se o item pertence ao carrinho
    const item = await CartItem.query()
      .where('productId', Number(itemId))
      .andWhere('cart_id', Number(cartId)) // Verifique se o item pertence ao carrinho
      .firstOrFail() // Lança um erro se não encontrar

    await item.delete() // Remove o item do carrinho
    return response.status(204) // Retorna status 204 sem conteúdo
  }
}

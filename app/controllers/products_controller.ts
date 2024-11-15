import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'



export default class ProductController {
  public async products({ response }: HttpContext) {
    try {
      const products = await Product.all() // Busca todos os produtos
      return response.status(200).json(products) // Retorna os produtos com status 200
    } catch (error) {
      return response.status(500).json({ message: 'Erro ao buscar produtos', error }) // Manipulação de erro
    }
  }

  // Método para obter um produto específico (opcional)
  public async productsById({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id) // Busca um produto pelo ID
      return response.status(200).json(product) // Retorna o produto com status 200
    } catch (error) {
      return response.status(404).json({ message: 'Produto não encontrado' }) // Manipulação de erro
    }
  }
}

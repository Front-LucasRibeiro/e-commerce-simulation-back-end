/* eslint-disable @unicorn/no-await-expression-member */
import router from '@adonisjs/core/services/router'

// Importação dinâmica do CartController
const CartController = async () => (await import('#controllers/carts_controller')).default

// Importação dinâmica do ProductsController
const ProductsController = async () => (await import('#controllers/products_controller')).default

router
  .group(() => {
    // Rotas para o Cart
    router.post('cart', async (ctx) => {
      const Controller = await CartController()
      const controllerInstance = new Controller()
      return controllerInstance.createCart(ctx) // Chama o método 'createCart'
    })

    router.get('cart/:userId/items', async (ctx) => {
      const Controller = await CartController()
      const controllerInstance = new Controller()
      return controllerInstance.getItems(ctx) // Chama o método 'getItems'
    })

    router.put('cart/:id/items', async (ctx) => {
      const Controller = await CartController()
      const controllerInstance = new Controller()
      return controllerInstance.addItems(ctx) // Chama o método 'getItems'
    })

    router.delete('cart/:cartId/item/:itemId', async (ctx) => {
      const Controller = await CartController()
      const controllerInstance = new Controller()
      try {
        return await controllerInstance.removeItemCart(ctx) // Chama o método 'removeItemCart'
      } catch (error) {
        ctx.response.status(400).send({ message: error.message }) // Retorna uma mensagem de erro
      }
    })

    // Nova rota para atualizar a quantidade de um item
    router.put('cart/:id/item', async (ctx) => {
      const Controller = await CartController()
      const controllerInstance = new Controller()
      return controllerInstance.updateItemQuantity(ctx) // Chama o novo método
    })

    // Rotas para os produtos
    router.get('products', async (ctx) => {
      const Controller = await ProductsController()
      const controllerInstance = new Controller()
      return controllerInstance.products(ctx) // Chama o método 'products'
    })

    router.get('products/:id', async (ctx) => {
      const Controller = await ProductsController()
      const controllerInstance = new Controller()
      return controllerInstance.productsById(ctx) // Chama o método 'productsById'
    })
  })
  .prefix('api')

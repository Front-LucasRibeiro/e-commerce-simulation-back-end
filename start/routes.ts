
import router from '@adonisjs/core/services/router'
const ProductsController = () => import('#controllers/products_controller')


router.group(() => {
  router.get('products', [ProductsController, 'products'])
  router.get('cart', () => { })

}).prefix('api')

import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Criando um usuário fictício
    await User.create({
      full_name: 'João Silva',
      email: 'joao.silva@example.com',
      password: await hash.make('senhaFicticia123'), // Criptografando a senha
    })
  }
}

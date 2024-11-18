import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)

const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

const startServer = async () => {
  try {
    const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER })

    const app = await ignitor
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .tap((app) => {
        app.booting(async () => {
          await import('#start/env')
        })
        app.listen('SIGTERM', () => app.terminate())
        app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
      })
      .httpServer()

    const port = Number(process.env.PORT) || 3333

    await app.start()

    console.log(`Server started on http://:${port}`)
  } catch (error) {
    process.exitCode = 1
    prettyPrintError(error)
  }
}

startServer()

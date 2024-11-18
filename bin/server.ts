/* eslint-disable @typescript-eslint/no-shadow */
import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { createServer, Server, IncomingMessage, ServerResponse } from 'node:http'

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
      .tap((app) => {
        app.booting(async () => {
          await import('#start/env')
        })
        app.listen('SIGTERM', () => app.terminate())
        app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
      })
      .httpServer()

    const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3333
    const host = '0.0.0.0' // Bind to all available network interfaces

    try {
      await app.start((handler: (req: IncomingMessage, res: ServerResponse) => void) => {
        const server: Server = createServer(handler)
        server.listen(port, host, () => {
          console.log(`Server started on http://${host}:${port}`)
        })
        return server
      })
    } catch (error) {
      console.error('Failed to start server:', error)
      process.exit(1)
    }
  } catch (error) {
    process.exitCode = 1
    prettyPrintError(error)
  }
}

startServer()

/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes.
|
*/

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { Env } from '@adonisjs/core/env'

/**
 * URL to the application root. AdonisJS needs it to resolve
 * paths to files and directories for scaffolding commands.
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in the context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

const startServer = async () => {
  try {
    // Initialize the application with the Ignitor
    const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER })

    // Boot the application
    const app = await ignitor
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .tap((app) => {
        app.booting(async () => {
          await import('#start/env') // Load the environment variables
        })
        // Listen for termination signals
        app.listen('SIGTERM', () => app.terminate())
        app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
      })
      .httpServer() // Get the HttpServer instance

    // Get the PORT and HOST from environment variables
    const port = 3333 // Default to 3333 if PORT is not defined
    const host = '0.0.0.0' // Bind to all network interfaces

    // Start the HTTP server on the specified host and port
    await app.start()

    console.log(`Server started on http://${host}:${port}`)
  } catch (error) {
    process.exitCode = 1
    prettyPrintError(error)
  }
}

// Call the function to start the server
startServer()

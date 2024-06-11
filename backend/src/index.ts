//-----------------------------------------
// ------------ TYPE ORM ------------------
//-----------------------------------------

import 'reflect-metadata'
import { dataSource } from './datasource'

//-----------------------------------------
// --------- GRAPHQL / APOLLO SERVER ------
//-----------------------------------------

import { getSchema } from './schema'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'

//-----------------------------------------
// ------------ EXPRESS -------------------
//-----------------------------------------

import { expressMiddlewares } from './routes'
import express from 'express'
import http from 'http'
import cors from 'cors'
import path from 'path'

//-----------------------------------------
// ----------- APOLLO SERVER --------------
//-----------------------------------------

const app = express()
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(
  '/api/assets/images',
  express.static(path.join(__dirname, '../public/assets/images'))
)
const httpServer = http.createServer(app)

async function start() {
  const port = process.env.BACKEND_PORT || 5000
  const schema = await getSchema()

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await dataSource.initialize()
  await server.start()
  expressMiddlewares(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  useServer(
    {
      schema,
      context: async (wsContext) => {
        console.log('WebSocket context:', wsContext)
        return {
          connection: wsContext.connectionParams,
        }
      },
      onConnect: (context) => {
        console.log('-----------------Connected!-----------------', context)
        // Vous pouvez ajouter une vérification ici pour valider le token si nécessaire
      },
      onDisconnect: (code, reason) => {
        console.log(
          '-------------Disconnected!-------------------',
          code,
          reason
        )
      },
    },
    wsServer
  )

  app.use(
    '/',
    express.json({ limit: '50mb' }),
    expressMiddleware(server, {
      context: async (args) => {
        return {
          req: args.req,
          res: args.res,
        }
      },
    })
  )

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
  console.log(`🚀 Server ready at port ${port} 🚀`)
}

start()

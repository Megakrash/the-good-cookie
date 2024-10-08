//-----------------------------------------
// ------------ TYPE ORM ------------------
//-----------------------------------------

import 'reflect-metadata'
import { dataSource } from './datasource'

//-----------------------------------------
// ------ GRAPHQL / APOLLO SERVER ---------
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

import express, { Request, Response } from 'express'
import http from 'http'
import cors from 'cors'
import { middleware } from './routes'

//-----------------------------------------
// -------------- SERVER ------------------
//-----------------------------------------

const app = express()
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))

const httpServer = http.createServer(app)

async function start() {
  const port = process.env.BACKEND_PORT || 5000
  const schema = await getSchema()
  await dataSource.initialize()

  const wsServer = new WebSocketServer({
    server: httpServer,
  })
  const serverCleanup = useServer(
    {
      schema,
      context: (connection) => {
        return {
          req: connection.extra.request,
          res: null,
        }
      },
    },
    wsServer
  )

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use('/', (req: Request, res: Response, next) => {
    if (
      req.path === '/api/search-address' ||
      req.path === '/api/sendcontactemail'
    ) {
      return next()
    }

    express.json({ limit: '50mb' })(req, res, (err) => {
      if (err) {
        return next(err)
      }
      expressMiddleware(server, {
        context: async (args) => {
          return {
            req: args.req,
            res: args.res,
          }
        },
      })(req, res, next)
    })
  })

  middleware(app)
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
  console.log(`🚀 Server ready at port ${port} 🚀`)
}

start()

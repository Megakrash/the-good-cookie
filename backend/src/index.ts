// ------------ TYPE ORM ------------------

import 'reflect-metadata'
import { dataSource } from './datasource'

// --------- GRAPHQL / APOLLO SERVER ------

import { getSchema } from './schema'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

// ------------ EXPRESS -------------------

import { expressMiddlewares } from './routes'
import express from 'express'
import http from 'http'
import cors from 'cors'
import path from 'path'

// ------------ SOCKET.IO -----------------

import { Server as SocketIOServer } from 'socket.io'

// ------------ SERVER -------------------
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

async function start() {
  const port = process.env.BACKEND_PORT || 5000
  const schema = await getSchema()
  const httpServer = http.createServer(app)

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await dataSource.initialize()
  await server.start()
  expressMiddlewares(app)
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

  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('message', (msg) => {
      console.log('message: ' + msg)
      io.emit('message', msg)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
  console.log(`🚀 Server ready at port ${port} 🚀`)
}

start()

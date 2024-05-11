//-----------------------------------------
// -----------------TYPE ORM----------------
//-----------------------------------------

import 'reflect-metadata'
import { dataSource } from './datasource'

//-----------------------------------------
// ----------GRAPHQL / APOLLO SERVER-------
//-----------------------------------------

import { getSchema } from './schema'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

//-----------------------------------------
// -----------------EXPRESS----------------
//-----------------------------------------

import { expressMiddlewares } from './routes'
import express from 'express'
import http from 'http'
import cors from 'cors'
import path from 'path'

//-----------------------------------------
// -----------------APOLLO SERVER-----------
//-----------------------------------------

const app = express()
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    console.log('Origin of request received: ' + origin)
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000']
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.error('CORS error for origin: ' + origin)
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'x-apollo-operation-name',
    'apollo-require-preflight',
  ],
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

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
  console.log(`🚀 Server ready at port ${port} 🚀`)
}

start()

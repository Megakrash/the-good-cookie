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

import { expressMiddlewares } from './routes'
import express from 'express'
import http from 'http'
import cors from 'cors'
import path from 'path'
import { uploadPicture } from './utils/pictureServices/multer'
import { createImage } from './utils/pictureServices/pictureServices'

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
app.use(
  '/api/assets/images',
  express.static(path.join(__dirname, '../public/assets/images'))
)
const httpServer = http.createServer(app)
app.post('/picture', uploadPicture.single('file'), async (req, res) => {
  if (req.file) {
    try {
      const picture = await createImage(req.file.filename)
      res.json(picture)
    } catch (error) {
      res.status(500).send('Error saving picture')
    }
  } else {
    res.status(400).send('No file was uploaded.')
  }
})
expressMiddlewares(app)

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

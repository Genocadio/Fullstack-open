const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY'; // Use environment variable

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));



// Create Apollo Server instance

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({typeDefs, resolvers})
  const serverCleanup = useServer({schema}, wsServer)

  const server = new ApolloServer({
    schema,
    pulgins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })

  await server.start()
  app.use((req, res, next) => {
    console.log('Incoming request:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
    
    },
    '------------------------------------'
  );
    next();
  });
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id).populate('favoriteGenre')
          return { currentUser }
        }
      },
    }),
  )
  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}



start()
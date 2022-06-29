import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import dotenv from "dotenv";
import { ChatResolver } from "./resolvers/ResolverChat";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

dotenv.config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  const schema = await buildSchema({
    resolvers: [ChatResolver],
    validate: false,
  });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: "/subscription",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const apolloServer = new ApolloServer({
    schema: schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
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
  });

  apolloServer.start().then(() => {
    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.listen(process.env.PORT, () => {
      console.log(
        `Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
      );
    });
  });
};

main().catch((err) => {
  console.log(err);
});

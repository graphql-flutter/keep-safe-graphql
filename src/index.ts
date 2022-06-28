import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import dotenv from "dotenv";
import { ChatResolver } from "./resolvers/ResolverChat";

dotenv.config();

const main = async () => {
  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: false }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ChatResolver],
      validate: false,
    }),
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

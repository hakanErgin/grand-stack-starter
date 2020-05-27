import { typeDefs } from './graphql-schema';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import neo4j from 'neo4j-driver';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import dotenv from 'dotenv';

// set environment variables from ../.env
dotenv.config();

const app = express();

const schema = makeAugmentedSchema({
  typeDefs,
  context: ({ req, res }) => ({ req, res }),
});

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
);

const server = new ApolloServer({
  context: { driver },
  schema: schema,
  introspection: true,
  playground: true,
});

const port = process.env.GRAPHQL_LISTEN_PORT || 4001;
const path = '/graphql';
server.applyMiddleware({ app, path });

app.listen({ port, path }, () => {
  console.log(`GraphQL server ready at http://localhost:${port}${path}`);
});

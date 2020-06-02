import { typeDefs } from './graphql-schema';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import neo4j from 'neo4j-driver';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { resolvers } from './resolvers';

dotenv.config();
const SECRET =
  process.env.JWT_SECRET ||
  'ybeFQvInmcfB2xcjdbGtRosdfME_zMQmFkpFNH6vDyG3Skb23NKA1uN91DB0ZK6c28cHgUNHyOdjUBM-VxsZpuejHZXeTMn46M99Vb5_01pDISTgIu8vxdmtOVlRN-zy5TM60zZfFgFh4J-DsUy3H_jOoRd3ofVwKXMZ4hiYsUk';
const app = express();

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers,
  config: {
    query: false,
    mutation: false,
  },
});

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
);

const injectUser = async (req) => {
  const token = req.headers.authorization;
  try {
    const { user } = await jwt.verify(token, SECRET);
    req.user = user;
  } catch (error) {
    console.error(error);
  }
  req.next();
};

app.use(injectUser);

const server = new ApolloServer({
  context: ({ req }) => ({ driver, SECRET, user: req.user || null }),
  schema,
});

const port = process.env.GRAPHQL_LISTEN_PORT || 4001;
const path = '/graphql';
server.applyMiddleware({ app, path });

app.listen({ port, path }, () => {
  console.log(`GraphQL server ready at http://localhost:${port}${path}`);
});

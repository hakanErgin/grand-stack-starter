'use strict';

var _graphqlSchema = require('./graphql-schema');

var _apolloServerExpress = require('apollo-server-express');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _neo4jDriver = require('neo4j-driver');

var _neo4jDriver2 = _interopRequireDefault(_neo4jDriver);

var _neo4jGraphqlJs = require('neo4j-graphql-js');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set environment variables from ../.env
_dotenv2.default.config();

var app = (0, _express2.default)();

var schema = (0, _neo4jGraphqlJs.makeAugmentedSchema)({
  typeDefs: _graphqlSchema.typeDefs,
  context: function context(_ref) {
    var req = _ref.req,
        res = _ref.res;
    return { req: req, res: res };
  }
});

var driver = _neo4jDriver2.default.driver(process.env.NEO4J_URI || 'bolt://localhost:7687', _neo4jDriver2.default.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'neo4j'));

var server = new _apolloServerExpress.ApolloServer({
  context: { driver: driver },
  schema: schema,
  introspection: true,
  playground: true
});

var port = process.env.GRAPHQL_LISTEN_PORT || 4001;
var path = '/graphql';
server.applyMiddleware({ app: app, path: path });

app.listen({ port: port, path: path }, function () {
  console.log('GraphQL server ready at http://localhost:' + port + path);
});
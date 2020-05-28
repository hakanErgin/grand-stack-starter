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

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _resolvers = require('./resolvers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config();
var SECRET = process.env.JWT_SECRET || '';
var app = (0, _express2.default)();

var schema = (0, _neo4jGraphqlJs.makeAugmentedSchema)({
  typeDefs: _graphqlSchema.typeDefs,
  resolvers: _resolvers.resolvers,
  config: {
    query: false,
    mutation: false
  }
});

var driver = _neo4jDriver2.default.driver(process.env.NEO4J_URI || 'bolt://localhost:7687', _neo4jDriver2.default.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'neo4j'));

var injectUser = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var token, _ref2, user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers.authorization;
            _context.prev = 1;
            _context.next = 4;
            return _jsonwebtoken2.default.verify(token, SECRET);

          case 4:
            _ref2 = _context.sent;
            user = _ref2.user;

            req.user = user;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);

            console.error(_context.t0);

          case 12:
            req.next();

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 9]]);
  }));

  return function injectUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

app.use(injectUser);

var server = new _apolloServerExpress.ApolloServer({
  context: function context(_ref3) {
    var req = _ref3.req;
    return { driver: driver, SECRET: SECRET, user: req.user || null };
  },
  schema: schema
});

var port = process.env.GRAPHQL_LISTEN_PORT || 4001;
var path = '/graphql';
server.applyMiddleware({ app: app, path: path });

app.listen({ port: port, path: path }, function () {
  console.log('GraphQL server ready at http://localhost:' + port + path);
});
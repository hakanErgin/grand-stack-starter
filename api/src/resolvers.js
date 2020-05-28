import { neo4jgraphql } from 'neo4j-graphql-js';
import bcrypt from 'bcrypt';
import { pick, isNil } from 'lodash';
import { createToken } from './auth/auth';

export const resolvers = {
  Mutation: {
    RegisterUser: async (object, params, context, resolveInfo) => {
      const user = params;
      user.password = await bcrypt.hash(user.password, 12);
      return neo4jgraphql(object, user, context, resolveInfo, true);
    },
    Login: async (object, { email, password }, context, resolveInfo) => {
      const user = await neo4jgraphql(
        object,
        { email, password },
        context,
        resolveInfo
      );
      if (!user) {
        throw new Error('No user with that email');
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
        return null;
      }

      const signedToken = await createToken(
        {
          user: { id: user.id },
        },
        context.SECRET
      );

      return `${signedToken}`;
    },
  },
  Query: {
    currentUser: async (object, params, context, resolveInfo) => {
      const userID = context.user.id;
      if (isNil(userID)) {
        return null;
      }

      const { id, email } = await neo4jgraphql(
        object,
        { user: userID },
        context,
        resolveInfo
      );

      return {
        id,
        email,
      };
    },
  },
};

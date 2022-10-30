const { gql, ApolloServer } = require('apollo-server');
const { Neo4jGraphQLAuthJWTPlugin } = require('@neo4j/graphql-plugin-auth');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  plugins: {
    auth: new Neo4jGraphQLAuthJWTPlugin({
      secret: 'HEIL!CTB',
      globalAuthentication: true,
    }),
  },
});

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema,
  });

  server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`GraphQL server ready on ${url}`);
  });
});

export default /* GraphQL */ `
  mutation {
    User: CreateUser(name: "Hakan", email: "hakan.ergin@gmail.com") {
      name
      email
    }
  }
`;

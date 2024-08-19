const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    bookCount: Int!
    me: User
  }
  type Subscription {
  bookAdded: Book!
  } 

  type Mutation {
    createAuthor(name: String!, born: Int): Author
    createUser(username: String!, favoriteGenre: String!, password: String!): User
    login(username: String!, password: String!): Token
    addBook(title: String!, published: Int!, author: String!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
 
`;
module.exports = typeDefs;
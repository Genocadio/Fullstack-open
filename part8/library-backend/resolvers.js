const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()


const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY'; //
const resolvers = {
    Query: {
      authorCount: async () => Author.countDocuments(),
      allAuthors: async () => Author.find({}),
      allBooks: async (root, args) => {
        let query = {};
        if (args.author) {
          query.author = args.author;
        }
        if (args.genre) {
          query.genres = args.genre;
        }
        return Book.find(query);
      },
      bookCount: async () => Book.countDocuments(),
      me: (root, args, context) => context.currentUser,
    },
    Mutation: {
      createUser: async (root, args) => {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(args.password, saltRounds);
  
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
          passwordHash,
        });
  
        try {
          return await user.save();
        } catch (error) {
          if (error.name === 'ValidationError') {
            throw new GraphQLError('User validation failed: ' + error.message, {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args,
              },
            });
          }
          throw new GraphQLError('Failed to create user');
        }
      },
  
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username });
        const passwordCorrect =
          user === null
            ? false
            : await bcrypt.compare(args.password, user.passwordHash);
  
        if (!user || !passwordCorrect) {
          throw new GraphQLError('Invalid username or password', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }
  
        const userForToken = {
          username: user.username,
          id: user._id,
        };
  
        return { value: jwt.sign(userForToken, JWT_SECRET) };
      },
  
      addBook: async (root, { title, published, author, genres }, context) => {
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }
  
        try {
          let authorObj = await Author.findOne({ name: author });
          if (!authorObj) {
            authorObj = new Author({ name: author });
            await authorObj.save();
          }
  
          const book = new Book({
            title,
            published,
            author: authorObj._id,
            genres,
          });
  
          await book.save();
  
          // Update the author's books field
          authorObj.books = authorObj.books.concat(book._id);
          await authorObj.save();
  
          pubsub.publish('BOOK_ADDED', { bookAdded: book });
  
          return book;
        } catch (error) {
          if (error.name === 'ValidationError') {
            throw new GraphQLError('Book validation failed: ' + error.message, {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: { title, published, author, genres },
              },
            });
          }
          throw new GraphQLError('Failed to add book');
        }
      },


  
      editAuthor: async (root, { name, setBornTo }, context) => {
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }
  
        try {
          const updatedAuthor = await Author.findOneAndUpdate(
            { name },
            { born: setBornTo },
            { new: true }
          );
          if (!updatedAuthor) {
            throw new GraphQLError('Author not found', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: { name },
              },
            });
          }
          return updatedAuthor;
        } catch (error) {
          throw new GraphQLError('Failed to edit author');
        }
      },
    },
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
      },
    Book: {
      author: async (root) => {
        return Author.findById(root.author); // Use ObjectId to find the author
      },
    },
    Author: {
        bookCount: async (root) => {
          return root.books.length; // Use the length of the books array
        },
      },
  };
  module.exports = resolvers
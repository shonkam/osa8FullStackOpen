require('dotenv').config()
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { UniqueDirectiveNamesRule } = require('graphql')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })
/*
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]


 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]
*/
const typeDefs = gql`
  
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]
  ): Book
  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author
}

type Query {
  bookCount: Int!
  authorCount: Int!
  allBooks(author: String, genre: String): [Book]
  allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {

      if (!args.genre && !args.author) {
        try {
          return await Book.find({})
        } catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args,
          })
        }
      }
      /*
      else if (!args.genre) {
        return books.filter(p => p.author === args.author)
      }
      */
      else {
        try {
          return await Book.find({ genres: { $in: [args.genre] } })
        } catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args,
          })
        }
      }
      /*
      else {
        let tempArray = books.filter(p => p.author === args.author)
        return tempArray.filter(p => p.genres.includes(args.genre))
      }
      */
    },
    allAuthors: async () => await Author.find({})
  },
  Author: {
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root) => root.born,
    bookCount: async (root) => {
      const length = await Book.find({ author: root.id })
      return length.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({ ...args, id: Math.floor(Math.random() * 1000000) })

      /*
      books = books.concat(book)

      if (authors.map(p => p.name === book.author).includes(true)) {
        return book
      }
      else {
        const newAuthor = {
          name: args.author,
          id: Math.floor(Math.random() * 1000000)
        }
        authors = authors.concat(newAuthor)
        */
      try {
        return await book.save()
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        })
      }


    },
    editAuthor: async (root, args) => {
      const editedAuthor = await Author.findOne({ name: args.name })
      editedAuthor.born = args.setBornTo
      try {
        return await editedAuthor.save()
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        })
      }
      /*
      const editedAuthor = authors.find(p => p.name === args.name)
      if (!editedAuthor) {
        return null
      }
      const updatedAuthor = { ...editedAuthor, born: args.setBornTo }
      authors = authors.map(p => p.name === args.name ? updatedAuthor : p)
      return updatedAuthor
      */
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
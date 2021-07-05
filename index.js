const { ApolloServer, gql } = require("apollo-server");

class Deck {
  cards = [];

  constructor() {
    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const symbols = ["♣", "♦", "♥", "♠"];
    symbols.map((symbol) => {
      numbers.map((number) => {
        this.cards.push({ number, symbol });
      });
    });
  }

  dispatchCards(size) {
    return new Array(size)
      .fill()
      .map(
        () =>
          this.cards.splice(parseInt(Math.random() * this.cards.length), 1)[0]
      );
  }
  fullDeck() {
    let allCards = [];
    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const symbols = ["♣", "♦", "♥", "♠"];
    symbols.map((symbol) => {
      numbers.map((number) => {
        allCards.push({ number, symbol });
      });
    });
    return allCards;
  }
}

const getFullDeck = () => {
  let allCards = [];
  const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
  const symbols = ["♣", "♦", "♥", "♠"];
  symbols.map((symbol) => {
    numbers.map((number) => {
      allCards.push({ number, symbol });
    });
  });
  return allCards;
};

const typeDefs = gql`
  type Card {
    number: String
    symbol: String
  }
  type User {
    uid: String
    name: String
    email: String
  }
  type Query {
    cards: [Card]
    fulldeck: [Card]
    getCards(cards: Int): [Card]
    table: [Card]
    getUsers: [User]
  }

  type Mutation {
    restoreCards: String
    addUser(name: String, email: String): [User]
  }
  type Subscription {
    userAdded: User
  }
`;

const users = require("./users.json");
let deck = new Deck();
let table = deck.dispatchCards(5);
let fulldeck = getFullDeck();

const resolvers = {
  Query: {
    cards: () => deck.cards,
    table: () => table,
    fulldeck: () => fulldeck,
    getCards: (_, { cards }) => deck.dispatchCards(cards),
    getUsers: () => [User],
  },
  Mutation: {
    restoreCards: () => {
      deck = new Deck();
      table = deck.dispatchCards(5);
      return `Ok`;
    },
    addUser: (_, { name, email }) => {
      if (!!users.find((user) => user.email === email)) {
        console.log("User is already in database");
      } else {
        users.push({
          uid: "jsfos789siofd",
          name,
          email,
        });
      }
      return users;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cacheControl: { defaultMaxAge: 5 },
});
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

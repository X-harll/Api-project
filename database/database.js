const books = [
  {
    ISBN: "12345Book",
    Title: "Tesla!!!",
    pubDate: "2021-08-05",
    Language: "en",
    numPage: 250,
    author: [1,2],
    publication: [1],
    category: ["tech", "space", "education"]
  }
]

const author = [
  {
    id: 1,
    name: "Val",
    books: ["12345Book", "secretBook"]
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["12345book"]
  }
]


const publication = [
  {
    id: 1,
    name: "writex",
    books: ["12345book"]
  },
  {
    id: 2,
    name: "writex2",
    books: []
  }
]

module.exports = {books, author, publication};

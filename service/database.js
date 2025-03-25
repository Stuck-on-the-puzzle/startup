const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('bookclub260');
const userCollection = db.collection('user');

// testing connection function
(async function testConnection() {
    try {
      await db.command({ ping: 1 });
      console.log(`Connect to database`);
    } catch (ex) {
      console.log(`Unable to connect to database with ${url} because ${ex.message}`);
      process.exit(1);
    }
})();

// user functions
function getUser(username) {
   return userCollection.findOne({ username: username })
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

// book functions
async function updateReadBook() {
    await userCollection.updateOne(
        { username: username },
        { $addToSet: { readBooks: book } }
    );
}

async function updateWishBook() {
    await userCollection.updateOne(
        { username: username },
        { $addToSet: { wishBooks: book } }
    );
}

async function removeReadBook(username, book) {
    await userCollection.updateOne(
        { username: username },
        { $pull: { readBook: { title: book.title } } }
    );
}

async function removeWishBook(username, book) {
    await userCollection.updateOne(
        { username: username },
        { $pull: { wishBook: { title: book.title } } }
    );
}




module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateReadBook,
  updateWishBook,
};
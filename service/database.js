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

async function getAllUsers() {
    const users = await userCollection.find().toArray();
    return users;
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
        { $pull: { readBooks: { title: book.title } } }
    );
}

async function removeWishBook(username, book) {
    await userCollection.updateOne(
        { username: username },
        { $pull: { wishBooks: { title: book.title } } }
    );
}

// friend functions
async function addFriend(username, friend) {
    await userCollection.updateOne(
        { username: username },
        { $addToSet: { friends: friend } }
    );
}

async function removeFriend(username, friend) {
    await userCollection.updateOne(
        { username: username },
        { $pull: { friends: { username: friend.username } } }
    );
}

async function addReview(username, review) {
    await userCollection.updateOne(
        { username: username },
        { $addToSet: { reviews: review } }
    );
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  getAllUsers,
  updateReadBook,
  updateWishBook,
  removeReadBook,
  removeWishBook,
  addFriend,
  removeFriend,
  addReview,
};
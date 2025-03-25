const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'authToken';

// Memory Data Structures but now comes from mongo
// let users = [];

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

let apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing User' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res,user.token);
    res.send({ username: user.username });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authroized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Get user Profile Info (user, friends, readbooks, wishlistbooks, reviews)
apiRouter.get('/user/profile', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    const friendsWithReadBooks = await Promise.all(user.friends.map(async (friend) => {
      const friendUser = await DB.getUser('username', friend.username);
      const friendBooksWithReviews = friendUser.readBooks.map((book) => {
        const review = friendUser.reviews.find((r) => r.bookTitle === book.title);
        return {
          friend: friendUser,
          bookTitle: book.title,
          review: review ? review.review : null,
        };
      });
          
      return {
        username: friend.username,
        readBooks: friendBooksWithReviews
      };
    }));

    res.send({ username: user.username, readBooks: user.readBooks, wishBooks: user.wishBooks, friends: friendsWithReadBooks, reviews: user.reviews });
    return;
  }
  res.statusMessage(401).send({ msg: 'Unauthorized' });
});

// Add book to read books
apiRouter.post('/user/readbooks', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    const { book } = req.body;
    if (!user.readBooks) {
      user.readBooks = [];
    }

    if (!user.readBooks.some(b => b.title === book.title)) {
      user.readBooks.push(book);
    }
    await DB.updateUser(user)
    res.send(user.readBooks);
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// add book to wishlist
apiRouter.post('/user/wishbooks', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    const { book } = req.body;
    if (!user.wishBooks) {
      user.wishBooks = [];
    }
    if (!user.wishBooks.some(b => b.title === book.title)) {
      user.wishBooks.push(book);
    }
    await DB.updateUser(user)
    res.send(user.wishBooks);
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// remove a book from readbooks
apiRouter.delete('/user/readbooks', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    const { book } = req.body;
    if (!user.readBooks) {
      user.readBooks = [];
    }
    user.readBooks = user.readBooks.filter(b => b.title !== book.title);
    await DB.updateUser(user);
    res.send(user.readBooks);
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// remove book from wishbooks
apiRouter.delete('/user/wishbooks', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    const { book } = req.body;
    if (!user.wishBooks) {
      user.wishBooks = [];
    }
    user.wishBooks = user.wishBooks.filter(b => b.title !== book.title);
    await DB.updateUser(user);
    res.send(user.wishBooks);
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// add Freinds
apiRouter.post('/user/friends', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    const { friend } = req.body;
    user.friends.push({ username: friend.username });
    await DB.updateUser(user);
    res.send(user.friends);
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// remove Friends
apiRouter.delete('/user/friends', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken('token', req.cookies[authCookieName]);
  if (user) {
    const { friend } = req.body;
    user.friends = user.friends.filter(f => f.username !== friend.username);
    await DB.updateUser(user)
    res.send(user.friends);
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// submit Review
apiRouter.post('/user/reviews', verifyAuth, async (req, res) => {
  const user = await DB.getUserByToken( req.cookies[authCookieName]);
  if (user) {
    const { username, bookTitle, review } = req.body;
    if (!user.reviews) {
      user.reviews = [];
    }
    const existingReview = user.reviews.findIndex(r => r.bookTitle === bookTitle);
    if (existingReview >= 0) {
      user.reviews[existingReview].review = review;
    } else {
      const newReview = { username, bookTitle, review}
      user.reviews.push(newReview)
    }
    await DB.updateUser(user);
    res.send(user.reviews);
    return;
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// default Error Handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// return the application's default page if path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Helper Functions!!
// Function to create user
async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
    readBooks: [],
    wishBooks: [],
    friends: [],
    reviews: [],
  };

  await DB.addUser(user);
  return user;
}

// Function to find user
async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: false, ///////////////CHANGE THIS TO TRUE
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
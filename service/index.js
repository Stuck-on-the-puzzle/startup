const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'authToken'; ////CHECK THIS PLEASE

// Memory Data Structures
let users = [];
let reviews = [];

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
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAith logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
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

// Get user Profile Info
apiRouter.get('/user/profile', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    res.send({ username: user.username, friends: user.friends });
    return
  }
  res.statusMessage(401).send({ msg: 'Unauthorized' });
});

// Get user friends
apiRouter.get('/user/friends', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    res.send(user.friends);
    return
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Get Reviews
apiRouter.get('/reviews', verifyAuth, (_req, res) => {
  res.send(reviews);
});

// Submit Reviews
apiRouter.post('/review', verifyAuth, (req, res) => {
  const { user, book, review } = req.body;
  let found = false;

  for (const [i, prevReview] of reviews.entries()) {
    if (prevReview.user === user && prevReview.book === book) {
      reviews[i].review = review;
      found = true;
      break;
    }
  }

  if (!found) {
    reviews.push({ user, book, review });
  }

  res.send(reviews);
});

// Default Error Handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if path is unknown
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
    friends: [],
  };
  users.push(user);

  return user;
}

// Function to find user
async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: false, ///////////////CHANGE THIS TO TRUE
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
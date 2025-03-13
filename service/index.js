const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bycrypt = require('bcryptjs');
const uuid = require('uuid');

// Memory Data Structures
let users = [];
let reviews = []

const port = process.argv.length > 2 ? process.argv[2] : 4000;

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
    if (await bycrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookies(res, user.token);
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

// Get Reviews
apiRouter.get('/reviews', verifyAuth, (_req, res) => {
  res.send(reviews);
});

// Submit Reviews
apiRouter.post('/review', verifyAuth, (req, res) => {
  reviews = updateReviews(req.body);
  res.send(reviews);
});

// Default Error Handler
app.use(function (err, rew, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Helper Functions!!
// review data structure isn't finalized so the .person/.book might need to be renamed
function updateReviews(newReview) {
  let found = false;
  for (const [i, prevReview] of reviews.entries()) {
    if (prevReview.person === newReview.person && prevReview.book === newReview.book) {
      reviews.splice(i, 1, newReview)
      found = true;
      break;
    }
  }

  if (!found) {
    reviews.push(newReview)
  }

  return reviews;
}

// Function to create user
async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
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
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
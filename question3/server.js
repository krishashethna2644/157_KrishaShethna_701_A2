const express = require('express');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Redis client setup
const redisClient = createClient({
  url: 'redis://localhost:6379'
});

let redisConnected = false;
redisClient.connect()
  .then(() => {
    redisConnected = true;
    console.log('Redis connected successfully');
  })
  .catch((err) => {
    console.log('Redis connection failed, using memory store:', err.message);
  });

// Session middleware with fallback
app.use(session({
  store: redisConnected ? new RedisStore({ client: redisClient }) : undefined,
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // 10 minutes
}));

// Dummy user store
const users = [{ username: 'admin', password: '1234' }];

// Middleware to protect dashboard
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login', { errors: [], old: {} });
});

app.post('/login',
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res) => {
    const errors = validationResult(req);
    const { username, password } = req.body;

    if (!errors.isEmpty()) {
      return res.render('login', { errors: errors.array(), old: req.body });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      req.session.user = { username };
      return res.redirect('/dashboard');
    }

    res.render('login', {
      errors: [{ msg: 'Invalid credentials' }],
      old: req.body
    });
  }
);

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
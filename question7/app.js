const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/shopping', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'shopping-secret',
  resave: false,
  saveUninitialized: false
}));

// Models
const Category = mongoose.model('Category', {
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
});

const Product = mongoose.model('Product', {
  name: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: { type: Number, default: 0 }
});

// Routes
app.get('/', async (req, res) => {
  const categories = await Category.find({ parent: null }).populate('parent');
  const subcategories = await Category.find({ parent: { $ne: null } }).populate('parent');
  const products = await Product.find().populate('category');
  res.render('index', { categories, subcategories, products, cart: req.session.cart || [] });
});

app.get('/admin', async (req, res) => {
  const categories = await Category.find().populate('parent');
  const products = await Product.find().populate('category');
  res.render('admin', { categories, products });
});

// Admin - Add Category
app.post('/admin/category', async (req, res) => {
  await new Category(req.body).save();
  res.redirect('/admin');
});

// Admin - Add Product
app.post('/admin/product', async (req, res) => {
  await new Product(req.body).save();
  res.redirect('/admin');
});

// User - Add to Cart
app.post('/cart/add', async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!req.session.cart) req.session.cart = [];
  
  const existing = req.session.cart.find(item => item.id === req.body.productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  res.redirect('/');
});

// User - View Cart
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.render('cart', { cart, total });
});

app.listen(3004, () => console.log('Server running on http://localhost:3004'));
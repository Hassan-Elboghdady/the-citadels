const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getProductsByCategory, getCategories } = require('../data/products');

router.get('/', (req, res) => {
  res.render('home', {
    title: 'The Citadels — Premium Imported Furniture for Distinctive Spaces',
    description: 'High-end furniture solutions for residential, hospitality, office, healthcare, laboratory, airport, and control-room environments across Egypt.',
    currentPage: 'home'
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About — The Citadels',
    description: 'Founded in 2009, The Citadels is a family-owned company with a proven track record in engineering, contracting, fit-out, and furniture solutions across Egypt.',
    currentPage: 'about'
  });
});

router.get('/collections', (req, res) => {
  res.render('collections', {
    title: 'Furniture Collections — The Citadels',
    description: 'Explore premium imported furniture collections for residential, hotel, office, control room, healthcare, laboratory, and airport environments.',
    currentPage: 'collections',
    products: getAllProducts(),
    categories: getCategories()
  });
});

router.get('/product/:id', (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).render('404', {
      title: 'Product Not Found — The Citadels',
      currentPage: ''
    });
  }
  const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== product.id);
  res.render('product', {
    title: `${product.name} — The Citadels`,
    currentPage: 'collections',
    product,
    relatedProducts
  });
});

router.get('/cart', (req, res) => {
  res.render('cart', {
    title: 'Cart — The Citadels',
    currentPage: 'cart'
  });
});

router.get('/projects', (req, res) => {
  res.render('projects', {
    title: 'Projects & Experience — The Citadels',
    description: 'The Citadels has delivered furniture solutions across healthcare, railway, control-room, and specialized environments in Egypt.',
    currentPage: 'projects'
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact — The Citadels',
    description: 'Get in touch with The Citadels team. Visit our showroom, call us, or send an inquiry for premium imported furniture solutions.',
    currentPage: 'contact'
  });
});

router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', {
    title: 'Privacy Policy — The Citadels',
    description: 'Learn how The Citadels collects, uses, and protects your personal data.',
    currentPage: 'privacy-policy'
  });
});

router.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms & Conditions — The Citadels',
    description: 'Terms and conditions governing the use of The Citadels website and services.',
    currentPage: 'terms'
  });
});

router.get('/cookie-policy', (req, res) => {
  res.render('cookie-policy', {
    title: 'Cookie Policy — The Citadels',
    description: 'Learn about the cookies used on The Citadels website and how to manage them.',
    currentPage: 'cookie-policy'
  });
});

module.exports = router;

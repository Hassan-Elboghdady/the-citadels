`
const express = require('express');
const path = require('path');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found — The Citadels',
    currentPage: ''
  });
});

app.listen(PORT, () => {
  console.log(`The Citadels running at http://localhost:${PORT}`);
});

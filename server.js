const path = require('path');
const fs = require('fs');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'phonebook.json');

function readPhonebook() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writePhonebook(entries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    eq: (a, b) => a === b,
    cancelLink: function () {
      return '<a href="/" class="btn btn-secondary">Отказаться</a>';
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  const entries = readPhonebook();
  res.render('home', {
    title: 'Телефонный справочник',
    entries,
    mode: 'home'
  });
});

app.get('/Add', (req, res) => {
  const entries = readPhonebook();
  res.render('add', {
    title: 'Добавить запись',
    entries,
    mode: 'add'
  });
});

app.get('/Update', (req, res) => {
  const id = parseInt(req.query.id, 10);
  const entries = readPhonebook();
  const current = entries.find(e => e.id === id);

  if (!current) {
    return res.redirect('/');
  }

  res.render('update', {
    title: 'Изменить запись',
    entries,
    mode: 'update',
    current
  });
});

app.post('/Add', (req, res) => {
  const { name, phone } = req.body;
  const entries = readPhonebook();
  const maxId = entries.reduce((max, e) => Math.max(max, e.id), 0);
  const newEntry = {
    id: maxId + 1,
    name: name || '',
    phone: phone || ''
  };
  entries.push(newEntry);
  writePhonebook(entries);
  res.redirect('/');
});

app.post('/Update', (req, res) => {
  const id = parseInt(req.body.id, 10);
  const { name, phone } = req.body;
  const entries = readPhonebook();
  const idx = entries.findIndex(e => e.id === id);
  if (idx !== -1) {
    entries[idx].name = name || '';
    entries[idx].phone = phone || '';
    writePhonebook(entries);
  }
  res.redirect('/');
});

app.post('/Delete', (req, res) => {
  const id = parseInt(req.body.id, 10);
  let entries = readPhonebook();
  entries = entries.filter(e => e.id !== id);
  writePhonebook(entries);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


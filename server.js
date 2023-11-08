const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const oracledb = require('oracledb');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const filePath = path.join(__dirname, 'movies.json');

// Générer une clé secrète aléatoire
const secretKey = crypto.randomBytes(32).toString('hex');

// Configuration de la session avec la clé secrète
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  const isSubscribed = req.session.isSubscribed; // Récupérez la valeur d'abonnement depuis la session
  res.render('index', { isSubscribed });
});

// Route pour la racine de l'URL
app.get('/watch', (req, res) => {
  const isSubscribed = req.session.isSubscribed; // Récupérez la valeur d'abonnement depuis la session
  res.render('watch', { isSubscribed });
});

app.get('/subscription', (req, res) => {
  const isSubscribed = req.session.isSubscribed; // Récupérez la valeur d'abonnement depuis la session
  res.render('subscription', { isSubscribed });
});

// Route pour le fichier movies.json
app.get('/movies.json', (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    }
  });
});

// Utiliser express.static pour servir les fichiers statiques
app.use(express.static('public'));

const dbConfig = {
  user: '', // Login
  password: '', // Password
  connectString: '' // Host:Port/ServiceName
};

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Connected to Oracle Database');

    const connection = await oracledb.getConnection();
    const query = 'SELECT * FROM UTILISATEUR';
    const result = await connection.execute(query);

    connection.close();
  } catch (err) {
    console.error('Error connecting to Oracle Database:', err);
  }
}

// Utilisez bodyParser pour analyser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour gérer la soumission du formulaire de connexion
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const connection = await oracledb.getConnection();
    const query = 'SELECT PASSWORD, SUBSCRIBED FROM UTILISATEUR WHERE EMAIL = :email';
    const binds = { email };
    const result = await connection.execute(query, binds);

    if (result.rows.length > 0) {
      const storedHashedPassword = result.rows[0][0];
      const userSubscribed = result.rows[0][1];

      const isPasswordValid = await bcryptjs.compare(password, storedHashedPassword);

      if (isPasswordValid) {
        let subscribed = false;

        req.session.isSubscribed = userSubscribed;
        res.redirect('/'); // Redirigez après la connexion
      } else {
        res.send('Invalid email or password.');
      }
    } else {
      res.send('Invalid email or password.');
    }

    connection.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/'); // Redirigez après la déconnexion
  });
});

app.post('/signup', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    if (!email || !password || password !== confirmPassword) {
      res.status(400).json({ error: "Invalid input." });
      return;
    }

    const saltRounds = 10; // Nombre de tours de hachage
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const connection = await oracledb.getConnection();
    const query = 'INSERT INTO UTILISATEUR (ID, EMAIL, PASSWORD, SUBSCRIBED) VALUES (SEQ_UTILISATEUR.nextval, :email, :password, 0)';
    const binds = { email, password: hashedPassword }; // Stockez le mot de passe haché

    const result = await connection.execute(query, binds);
    connection.commit(); // Valider la transaction
    connection.release(); // Libérer la connexion

    res.redirect('/');
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/check-subscription', (req, res) => {
  const isSubscribed = req.session.isSubscribed; // Utiliser 0 comme valeur par défaut si non défini
  res.json({ isSubscribed });
});

initialize();

// Lancer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000 : http://localhost:3000');
});

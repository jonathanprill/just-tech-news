const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path');

// import the helper functions
const helpers = require('./utils/helpers');

const app = express();
//This uses Heroku's process.env.PORT value when deployed
// And 3001 when run locally.
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handlebars
const exphbs = require('express-handlebars');
// pass the helpers 
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//handlebars

//Cookies
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
//Cookies

//This method is useful for front-end specific files like images, style sheets, and js files. 
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
//.sync Sequelize taking the models and connecting them to associated database tables
//TOGGLE { force: fasle to true } to reset tables! True will delete things
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
//This uses Heroku's process.env.PORT value when deployed
// And 3001 when run locally.
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
//.sync Sequelize taking the models and connecting them to associated database tables
//TOGGLE { force: fasle to true } to reset tables! True will delete things
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
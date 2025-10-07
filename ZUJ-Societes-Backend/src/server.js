const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection failed', err);
  process.exit(1);
});

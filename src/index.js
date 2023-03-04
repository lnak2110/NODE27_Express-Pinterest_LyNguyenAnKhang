const express = require('express');
const cors = require('cors');

const rootRoute = require('./routes/root.route');
const config = require('./utils/config');

const app = express();

app.use(express.json());
app.use(express.static('.'));
app.use(cors());

app.use('/api', rootRoute);

const port = config.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

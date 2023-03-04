const express = require('express');
const authRoute = require('./auth.route');
const pictureRoute = require('./picture.route');
const userRoute = require('./user.route');
const { notFoundCode } = require('../utils/response');

const rootRoute = express.Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/pictures', pictureRoute);
rootRoute.use('/users', userRoute);
rootRoute.use('*', (req, res) => notFoundCode(res));

module.exports = rootRoute;

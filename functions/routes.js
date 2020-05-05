const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate')

const NewsController = require('./controller/NewsController')

const routes = express.Router()

routes.post("/robotNews", NewsController.create)

routes.post("/robotNews", NewsController.save)

module.exports = routes
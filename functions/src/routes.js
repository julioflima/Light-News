const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate')

const NewsController = require('../src/controller/NewsController')

const routes = express.Router()

routes.post("/robotNews", celebrate({
    [Segments.BODY]:
        Joi.object().keys({
            someURL: Joi.string().required().uri(),
            lang: Joi.string().length(2)
        })
}), NewsController.create)

routes.post("/robotNews", NewsController.save)

module.exports = routes
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const NewsController = require('./controller/NewsController');
const LinksController = require('./controller/LinksController');

const { host } = require('./custom/validator');

const routes = express.Router();

routes.post('/robotNews', celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      someURL: Joi.string().required().uri().custom((url, helpers) => host(url, helpers, 'words')),
      lang: Joi.string().length(2),
    }),
}), NewsController.create);

routes.post('/robotNews', NewsController.save);

routes.get('/robotNews', celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      pageCursor: Joi.string(),
    }),
}), NewsController.index);

routes.delete('/robotNews', celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      news: Joi.string(),
      font: Joi.string(),
    }),
}), NewsController.delete);

routes.get('/robotLinks', celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      someURL: Joi.string().required().uri().custom((url, helpers) => host(url, helpers, 'links')),
    }),
}), LinksController.create);


module.exports = routes;

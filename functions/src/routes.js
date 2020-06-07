const parse = require('url-parse');
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const NewsController = require('./controller/NewsController');
const LinksController = require('./controller/LinksController');

const { words } = require('./database/listFilter.json');

const routes = express.Router();

routes.post('/robotNews', celebrate({
  [Segments.BODY]:
    Joi.object().keys({
      someURL: Joi.string().required().uri().custom((url) => {
        const host = parse(url).hostname;
        const hosts = Object.keys(words);
        if (!hosts.includes(host)) {
          const err = new Error();
          err.code = 406;
          err.address = url;
          err.message = 'This host is not available in this application.';
          err.info = `You could try these hosts: ${hosts}`;
          throw err;
        } else {
          return url;
        }
      }),
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
      someURL: Joi.string().required().uri(),
    }),
}), LinksController.create);


module.exports = routes;

import Joi from 'joi';

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email address',
      'any.required': 'Email is required',
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters',
      'any.required': 'Username is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const movieSchemas = {
  create: Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Title is required',
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5),
    imdb_id: Joi.string(),
    poster: Joi.string().uri(),
    plot: Joi.string().max(2000),
    runtime: Joi.number().integer(),
    genre: Joi.string(),
    director: Joi.string(),
    actors: Joi.string(),
    external_rating: Joi.number().min(0).max(10),
  }),

  update: Joi.object({
    title: Joi.string(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5),
    poster: Joi.string().uri(),
    plot: Joi.string().max(2000),
    runtime: Joi.number().integer(),
    genre: Joi.string(),
    director: Joi.string(),
    actors: Joi.string(),
    external_rating: Joi.number().min(0).max(10),
  }),

  search: Joi.object({
    query: Joi.string().required().min(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0),
  }),
};

export const watchlistSchemas = {
  add: Joi.object({
    movie_id: Joi.number().integer().required(),
    status: Joi.string().valid('to-watch', 'watching', 'watched').default('to-watch'),
  }),

  update: Joi.object({
    status: Joi.string().valid('to-watch', 'watching', 'watched').required(),
  }),
};

export const ratingSchemas = {
  create: Joi.object({
    movie_id: Joi.number().integer().required(),
    rating: Joi.number().min(1).max(10).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 10',
      'any.required': 'Rating is required',
    }),
  }),

  update: Joi.object({
    rating: Joi.number().min(1).max(10).required(),
  }),
};

export const reviewSchemas = {
  create: Joi.object({
    movie_id: Joi.number().integer().required(),
    review_text: Joi.string().required().min(1).max(5000).messages({
      'string.min': 'Review text is required',
      'any.required': 'Review text is required',
    }),
    rating: Joi.number().min(1).max(10),
  }),

  update: Joi.object({
    review_text: Joi.string().min(1).max(5000),
    rating: Joi.number().min(1).max(10),
  }),
};


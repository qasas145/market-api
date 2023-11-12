const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { productService } = require('../services');
const { getProducts, addProduct, updateProduct, deleteProduct, getAllProducts } = productService;

const { Product } = require('../models');

const {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  getCached,
  queryParser
} = require('../middlewares');

router.use(queryParser);

router.get("/all-products", (req, res)=>controller(res)(getAllProducts)(req, res))
router.get(
  '/search',
  (req, res, next) => getCached(res, next)('product', req.query),
  (req, res) => {controller(res)(getProducts)(req.query)}
);

router.get(
  '/top10-cheapest',
  (req, res, next) =>
    getCached(res, next)('product', {
      limit: 10,
      category: req.query.category,
      sort: 'price'
    }),
  (req, res) =>
    controller(res)(getProducts)({
      limit: 10,
      category: req.query.category,
      sort: 'price'
    })
);

router.get(
  '/top10-rated',
  (req, res, next) =>
    getCached(res, next)('product', {
      limit: 10,
      category: req.query.category,
      sort: '-avgRating'
    }),
  (req, res) =>
    controller(res)(getProducts)({
      limit: 10,
      category: req.query.category,
      sort: '-avgRating'
    })
);

router.get(
  '/most10-sold',
  (req, res, next) =>
    getCached(res, next)('product', {
      limit: 10,
      category: req.query.category,
      sort: '-numSold'
    }),
  (req, res) =>
    controller(res)(getProducts)({
      limit: 10,
      category: req.query.category,
      sort: '-numSold'
    })
);

router.get(
  '/:id',
  (req, res, next) => getCached(res, next)('product', { _id: req.params.id }),
  (req, res) => controller(res)(getProducts)({ _id: req.params.id })
);

// router.use(isAuthenticated, isAuthorized('seller'));

router.post('/', (req, res) => {req.session.user = { id: '653228e67ffb8c06d246efc4', role: 'seller', iat: 1697787133 };controller(res)(addProduct)(req.session.user.id, req.body)});

router.put(
  '/:id',
  (req, res, next) => {console.log(req.session);isResourceOwner(res, next)(Product, req.params.id, req.session.user.id),
  (req, res) => controller(res)(updateProduct)(req.params.id, req.body)
  }
);

router.delete(
  '/:id',
  (req, res, next) => isResourceOwner(res, next)(Product, req.params.id, req.session.user.id),
  (req, res) => controller(res)(deleteProduct)(req.params.id)
);

module.exports = router;

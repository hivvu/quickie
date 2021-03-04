const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const archive = require('../controller/archive');
const downloadQuickie = require('../controller/download');
const deleteQuickie = require('../controller/delete');
const saveQuickie = require('../controller/save');
const loadQuickie = require('../controller/load');
// const path = require('path');

let routes = (app) => {
  app.use(bodyParser.json());

  // WEB 
  router.get('/', (req, res) => {
    res.sendFile("index.html", { root: 'public' });
  });

  router.get('/id/*', (req, res) => {
    res.sendFile("index.html", { root: 'public' });
  });
  
  router.get('/preview/id/*', (req, res) => {
    res.sendFile("preview.html", { root: 'public' });
  });

  router.get('/history', (req, res) => {  
    res.sendFile("history.html", { root: 'public' });
  });

  // ENDPOINTS
  router.get('/download/:id', downloadQuickie.process);
  router.post('/save/:id', saveQuickie);
  router.get('/load/:id', loadQuickie);
  router.get('/archive', archive);
  router.get('/delete/:id', deleteQuickie);

  router.get('*', (req, res) => res.send('404! This is an invalid URL.'));

  app.use(router);
};

module.exports = routes;
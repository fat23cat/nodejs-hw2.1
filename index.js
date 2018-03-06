const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const axios = require('axios');
const consts = require('./consts/consts');
const url = require('url');
const qString = require('querystring');
const dataBase = mongoose.connection;
mongoose.connect(consts.MONGO_DB);

dataBase.on('error', (err) => {
  console.error('connection error:', err.message);
});

dataBase.once('open', () => {
  console.log("Connected to DB!");
  isCollectionEmpty();
});

app.listen(3001, () => {
  console.log('Express server listening on port 3001');
});

app.get('/api', (req, res) => {
  res.statusCode = 200;
  res.send({
    'response': 'API is running'
  });
});

app.get('/api/users/all', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.statusCode = 500;
      res.send({
        'response': 'request error'
      });
    } else {
      res.statusCode = 200;
      res.json(users);
    }
  });
});

app.get('/api/users', function(req, res) {
  let parsedUrl = url.parse(req.url);
  let parsedParams = qString.parse(parsedUrl.query);
  User.find({
    id: parsedParams.id
  }, function(err, user) {
    if (err) {
      res.statusCode = 500;
      res.send({
        'response': 'request error'
      });
    } else {
      res.statusCode = 200;
      res.json(user);
    }
  });
});

app.post('/api/users', function(req, res) {
  let parsedUrl = url.parse(req.url);
  let parsedParams = qString.parse(parsedUrl.query);
  User.create({
    id: parsedParams.id,
    name: parsedParams.name,
    username: parsedParams.username
  }, function(err, user) {
    if (err) {
      res.statusCode = 500;
      res.send({
        'response': 'request error'
      });
    }
    User.find({}, function(err, users) {
      if (err) {
        res.statusCode = 500;
        res.send({
          'response': 'request error'
        });
      } else {
        res.statusCode = 200;
        res.json(users);
      }
    });
  });
});

app.delete('/api/users', function(req, res) {
  let parsedUrl = url.parse(req.url);
  let parsedParams = qString.parse(parsedUrl.query);
  User.remove({
    _id: parsedParams.id
  }, function(err) {
    if (err) {
      res.statusCode = 500;
      res.send({
        'response': 'request error'
      });
    } else {
      res.statusCode = 200;
      res.send({
        'response': 'Successfully! User has been deleted.'
      });
    }
  });
});

app.put('/api/users', function(req, res) {
  let parsedUrl = url.parse(req.url);
  let parsedParams = qString.parse(parsedUrl.query);
  console.log(parsedParams);
  let _id = parsedParams.id;
  let data = {
    name: parsedParams.name,
    username: parsedParams.username
  }
  User.findByIdAndUpdate(_id, data, function(err, user) {
    if (err) {
      res.statusCode = 500;
      res.send({
        'response': 'request error'
      });
    } else {
      res.statusCode = 200;
      res.send({
        'response': 'Successfully! User has been updated.'
      });
    }
  });
});


function getUsers(isEmpty) {
  if (isEmpty) {
    axios.get(consts.API_URL)
      .then((response) => {
        response.data.forEach((item) => {
          const user = new User(item);
          user.save(function(err) {
            if (err)
              console.error(err);
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

function isCollectionEmpty() {
  User.find((err, docs) => {
    if (err) {
      console.log(err);
    }
    getUsers(!docs.length);
  });
};

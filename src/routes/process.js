const config = require('../config/app');

const verifyBasicAuthentication = (req, res, next) => {
  const authorizationHeader = req.get('Authorization');
  if (!authorizationHeader || authorizationHeader !== config.sepAuthToken) {
    res.statusCode = 401;
    res.send('Access denied');
  } else {
    next();
  }
};

module.exports = app => {
  const controller = require('../controllers/processController')();

  app.post('/process/update', verifyBasicAuthentication, controller.update);
};

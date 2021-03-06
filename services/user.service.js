require('dotenv').config();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const dbUtils = require('../utils/database.utils');
const dbConfig = require('../config/database.config');

const pool = mysql.createPool(dbConfig);

//TODO: HASH BEFORE QUERY FROM SERVER
// SQl statements
const SELECT_USER_BY_EMAIL_PASSWORD = 'select user_id, email, display_name from users where email = ? and password = sha2(?, 256)';
const selectUserByEmailPassword = dbUtils.mkQueryFromPool(dbUtils.mkQuery(SELECT_USER_BY_EMAIL_PASSWORD), pool);

const SELECT_USER_BY_USER_ID = 'select user_id, email, display_name from users where user_id = ?';
const selectUserById = dbUtils.mkQueryFromPool(dbUtils.mkQuery(SELECT_USER_BY_USER_ID, pool), pool);


module.exports = { signInUser, getUserById };

function signInUser(req, res, next) {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  console.log(user);
  _authenticateUser(user)
    .then(token => {
      res.status(200).json({ token_type: "Bearer", access_token: token });
    })
    .catch(error => {
      res.status(401).json({ message: "Something went wrong" });
    })
}


function _authenticateUser(user) {
  const { email, password } = user;
  return new Promise((resolve, reject) => {
    selectUserByEmailPassword([email, password])
      .then(result => {
        if (result.length > 0) {
          const now = new Date().getTime();
          const user = result[0];
          const token = jwt.sign({
            sub: user.user_id,
            iss: "funfruitapp",
            iat: Math.floor(now / 1000),
            
            // exp: Math.floor(now / 1000) + (60 * 15),
            exp: Math.floor(now / 1000) + 10,
            data: { ...user }
          }, process.env.JWT_SECRET)
          resolve(token);
        }
        reject();
      })
  })
};


function getUserById(user_id) {
  return new Promise((resolve, reject) => {
    selectUserById([user_id])
      .then(
        result => {
          if (result.length > 0) {
            resolve(result[0]);
          }
          reject();
        })
  })
};


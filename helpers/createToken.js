const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config');

function createToken(user){
 let payload={
    username: user.username,
    is_admin: user.is_admin
 }
 
 return jwt.sign(payload, SECRET_KEY)
}

module.exports = createToken;


// {
//    "handle":"samsung",
//    "name": "Samsung",
//    "num_employees": 10000,
//    "description": "Tech comp",
//    "logo_url": "samsung.com",       
// 	 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbmUiLCJpYXQiOjE1OTIzNzIwOTJ9.26BtKlfOlQw1EoqWU1O1gfNqFGnPWKuzC_PYffJno3A"
// }

// {
//    "username": "janeee",
//     "password": "password",
//     "first_name": "jane",
//     "last_name": "Jane",
//     "email": "jane123@test.com",
//     "photo_url": "google.com",
//     "is_admin": true
//  }
//  {
//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbmVlZSIsImlhdCI6MTU5MjM3Mjg3OH0.-eglSlc8Uwo2e1kO3HGDAou05mZw0czsYtQw2CJgRG4"
//  } 
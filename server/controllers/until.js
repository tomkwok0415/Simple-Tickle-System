const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

  async function checktoken(token) {
    try {
        const decoded = await jwt.verify(token, JWT_SECRET); //need async await     
        //console.log(decoded)   
        //console.log(typeof decoded.username);
        //const username = await decoded.username
        return decoded.username;
        //return username;
    } catch(err) {
        console.error(err);
        return null;
    }
}


module.exports = {
    jwt,
    bcrypt,
    JWT_SECRET,
    checktoken,
}
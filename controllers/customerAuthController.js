const jwt = require("jsonwebtoken");
const Customer = require('../models/customerModel')

const isAuth = async (req, res, next) => {
const token = req.headers.authorization.replace(/"/g, '').split(' ')[1];
console.log("token in authcontroller" ,token)

if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      const customer = await Customer.findOne({ email: decoded.customer.email }).exec();
      if (customer) {
        req.customer = decoded.customer;
        next();
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (error) {
      res.status(401).send("Invalid token");
    //   console.log(error)
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
    isAuth
}
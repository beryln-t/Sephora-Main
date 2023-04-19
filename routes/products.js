var express = require("express");
var router = express.Router();
const productCtrl = require("../controllers/products");
const { isAuth } = require("../controllers/customerAuthController");

router.get("/", productCtrl.showProducts);
router.post("/AdminProduct/new", isAuth, productCtrl.addProducts);
router.put("/AdminProduct/:id/edit", isAuth, productCtrl.updateProducts);

module.exports = router;

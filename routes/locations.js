const express = require("express");
const router = express.Router();
const locationsCtrl = require("../controllers/locations");
const { isAuth } = require("../controllers/customerAuthController");

router.get("/:productName", locationsCtrl.findLocationByProductName);
router.get("/", isAuth, locationsCtrl.showLocation);
router.delete(
  "/:locationId/products/:productId",
  isAuth,
  locationsCtrl.deleteLocProduct
);
router.put(
  "/:locationId/products/:productId",
  isAuth,
  locationsCtrl.editLocProductQty
);
router.get("/getlocation/:locationId", isAuth, locationsCtrl.showAddProduct);
router.post("/:locationId/", isAuth, locationsCtrl.addLocProduct);
router.delete(
  "/products/:productID",
  isAuth,
  locationsCtrl.deleteProductFromBothCol
);

module.exports = router;

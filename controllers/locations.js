const Location = require("../models/Location");
const Product = require("../models/Product");

const findLocationByProductName = async (req, res) => {
  try {
    const { productName } = req.params;
    const location = await Location.aggregate([
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productDetails",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $match: {
          "product.name": productName,
        },
      },
      {
        $project: {
          name: 1,
          productQty: "$products.productQty",
        },
      },
    ]);

    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const showLocation = async (req, res) => {
  try {
    const locations = await Location.aggregate([
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productDetails",
          foreignField: "_id",
          as: "products.productDetails",
        },
      },
      {
        $unwind: "$products.productDetails",
      },
      {
        $sort: {
          "products.productDetails.name": 1,
          name: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          latitude: { $first: "$latitude" },
          longitude: { $first: "$longitude" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          __v: { $first: "$__v" },
          products: { $push: "$products" },
        },
      },
    ]);
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteLocProduct = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const productId = req.params.productId;

    const location = await Location.findById(locationId);

    const productIndex = location.products.findIndex(
      (p) => p.productDetails.toString() === productId
    );

    // If the product exists in the array, remove it
    if (productIndex >= 0) {
      location.products.splice(productIndex, 1);
    } else {
      return res.status(404).json({ error: "Product not found in location" });
    }

    const updatedLocation = await location.save();

    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editLocProductQty = async (req, res) => {
  try {
    console.log("edit location quantity");
    const locationId = req.params.locationId;
    const productId = req.params.productId;
    const newProductQty = req.body.productQty;

    // Check that the new product quantity is not negative
    if (newProductQty < 0) {
      return res
        .status(400)
        .json({ error: "Product quantity cannot be negative" });
    }

    const location = await Location.findById(locationId);

    const product = location.products.find(
      (p) => p.productDetails.toString() === productId
    );

    // If the product exists in the array, update its quantity
    if (product) {
      product.productQty = newProductQty;
    } else {
      return res.status(404).json({ error: "Product not found in location" });
    }

    const updatedLocation = await location.save();

    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const showAddProduct = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    console.log(req.params.locationId);
    const location = await Location.findById(locationId).populate(
      "products.productDetails"
    );

    // Find all products not in location
    const allProducts = await Product.find({});
    const existingProducts = location.products.map((p) =>
      p.productDetails._id.toString()
    );
    const newProducts = allProducts
      .filter((p) => !existingProducts.includes(p._id.toString()))
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

    res.status(200).json({ location, newProducts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addLocProduct = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const productsToAdd = req.body.products;
    const location = await Location.findById(locationId);

    //check all product has quantity
    const hasMissingQuantity = productsToAdd.some(
      (product) => !product.productQty || product.productQty < 0
    );
    if (hasMissingQuantity) {
      throw new Error(
        "All selected products must have a non-negative quantity entered."
      );
    }

    // Check if selected products already exist in the location
    const existingProducts = location.products.map((product) =>
      product.productDetails.toString()
    );
    const newProducts = [];
    const existingProductNames = [];
    for (const product of productsToAdd) {
      if (existingProducts.includes(product.productId.toString())) {
        const existingProduct = await Product.findById(product.productId);
        existingProductNames.push(existingProduct.name);
      } else {
        newProducts.push({
          productDetails: product.productId,
          productQty: product.productQty,
        });
      }
    }

    if (existingProductNames.length > 0) {
      const message = `The following products already exist in the location, please select new products to add: ${existingProductNames.join(
        ", "
      )}`;
      throw new Error(message);
    }

    location.products.push(...newProducts);

    const updatedLocation = await location.save();

    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProductFromBothCol = async (req, res) => {
  try {
    const { productID } = req.params;
    console.log(productID);
    await Location.updateMany(
      { "products.productDetails": productID },
      { $pull: { products: { productDetails: productID } } },
      { multi: true }
    );
    await Product.findByIdAndDelete(productID);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
};

module.exports = {
  findLocationByProductName,
  showLocation,
  deleteLocProduct,
  editLocProductQty,
  showAddProduct,
  addLocProduct,
  deleteProductFromBothCol,
};

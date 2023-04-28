# Sephora Web Application

## Description of the Application

Sephora is a premier beauty and cosmetics retailer with a strong online presence as well as physical stores. The Sephora website is a comprehensive e-commerce platform, providing a wide range of makeup, skincare, hair care, fragrance, beauty tools, and accessories from multiple well-known brands. Our goal is to elevate the customer product browsing experience by implementing a feature that enables them to effortlessly locate the nearest outlet with their desired products. This is coupled with an admin-facing app that allows for product portfolio and store inventory management.

### Deployment

https://sephora-main.cyclic.app/

## Timeframe

7 Working Days

## Technologies & Tools Used

- React
- JavaScript
- CSS + Bootstrap
- Mongoose & Express
- Bcrypt (Hashing)
- JWT (Authentication)
- Mongo DB (Database)
- GitHub (version control)
- Cyclic (Deployment)

## Screenshots of the Application

<p align="center"><img src="https://i.imgur.com/fbFWeRI.png" width="70%" height="70%"> </p>
 <p align="center">[Product Browsing]</p>

 <p align="center"><img src="https://i.imgur.com/zpXia00.png" width="70%" height="70%"> </p>
 <p align="center">[Product Details]</p>

 <p align="center"><img src="https://i.imgur.com/UgGh6MW.png" width="70%" height="70%"> </p>
 <p align="center">[Product Portfolio]</p>

 <p align="center"><img src="https://i.imgur.com/nR0edHC.png" width="70%" height="70%"> </p>
 <p align="center">[Adding Products]</p>

 <p align="center"><img src="https://i.imgur.com/hhJ5aW0.png" width="70%" height="70%"> </p>
 <p align="center">[Inventory Management]</p>
 <p align="center"><img src="https://i.imgur.com/0aWISm8.png" width="70%" height="70%"> </p>
 <p align="center">[Inventory Management]</p>

## Model

<p align="center"><img src="https://i.imgur.com/LaIiH2m.png" width="70%" height="70%"> </p>
 <p align="center">[Data Model]</p>
 
## CRUD
### ADD Products to Location

```javascript
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
```

### Update Product

```javascript
const updateProducts = async (req, res) => {
  try {
    const updatedName = req.body.name;
    const existingProduct = await Products.findOne({ name: updatedName });
    if (existingProduct && existingProduct._id.toString() !== req.params.id) {
      throw new Error("Another product with the same name already exists");
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### Delete Product From location

```javascript
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
```

### Read Product

```javascript
const showProducts = async (req, res) => {
  try {
    const query = {};
    const products = await Products.find(query).sort({
      name: 1,
      category: 1,
      brand: 1,
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

## References

- https://www.sephora.sg/ (Image and Product resource)
- https://getbootstrap.com/ (CSS)

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./forms.css";
export default function EditProductsForm({
  products,
  handleEditProduct,
  category,
  brand,
}) {
  const { productID } = useParams();
  const navigate = useNavigate();
  const CONVERTTODOLLAR = 100;
  const product = products.find((p) => p._id === productID);

  const [editedProduct, setEditedProduct] = useState(
    product
      ? {
          name: product.name,
          price: product.price / CONVERTTODOLLAR,
          category: product.category,
          brand: product.brand,
          imgurl: product.imgurl,
          description: product.description,
        }
      : {}
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    const nameExists = products.some(
      (p) => p._id !== productID && p.name === editedProduct.name
    );
    if (nameExists) {
      alert("Product with the same name already exists!");
      return;
    } else {
      const newProduct = {
        ...editedProduct,
        price: editedProduct.price * CONVERTTODOLLAR, // divide price by 100 to convert it back to dollars
      };
      const response = await fetch(`/api/AdminProduct/${productID}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newProduct),
      });
      const updatedProduct = await response.json();
      handleEditProduct(updatedProduct);
      navigate("/productpage");
    }
  };

  const handleCancel = async () => {
    navigate("/productpage");
  };

  return (
    <>
      <div className="form-container">
        <h1>Edit Product</h1>
        <div>
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="form-input"
            id="name"
            name="name"
            value={editedProduct.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            className="form-input"
            id="price"
            name="price"
            value={editedProduct.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            name="category"
            value={editedProduct.category}
            onChange={handleChange}
            className="select-input"
          >
            {category.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="brand">
            Brand
          </label>
          <select
            name="brand"
            value={editedProduct.brand}
            onChange={handleChange}
            className="select-input"
          >
            {brand.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="imgurl">
            Image URL
          </label>
          <input
            type="text"
            className="form-input"
            id="imgurl"
            name="imgurl"
            value={editedProduct.imgurl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            className="form-input"
            id="description"
            name="description"
            value={editedProduct.description}
            onChange={handleChange}
            style={{ resize: "both" }} // make the textarea resizable
          />
        </div>
        <div>
          <button onClick={handleEdit} className="btn btn-dark mx-4">
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            type="button"
            className="btn btn-secondary mx-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./InventoryAdd.css";

export default function InventoryAdd() {
  const { state } = useLocation();
  const { selectedLocationData } = state;
  const { _id: locationId, name: locationName } = selectedLocationData;
  const [productList, setProductList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [checkedMap, setCheckedMap] = useState({});

  const navigate = useNavigate(); // Initialize the navigate object

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/locations/getlocation/${locationId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const { newProducts } = await response.json();
      setProductList(newProducts);
      resetCheckedList(newProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const resetCheckedList = (products) => {
    const productCheckedList = products.reduce((prev, product) => {
      prev[product._id] = false;
      return prev;
    }, {});
    setCheckedMap(productCheckedList);
  };

  useEffect(() => {
    fetchProducts();
  }, [locationId]);

  const handleCheckboxChange = (event, productId) => {
    const isChecked = event.target.checked;

    setCheckedMap((prevState) => ({
      ...prevState,
      [productId]: isChecked,
    }));

    const tableRow = event.target.closest("tr");
    if (isChecked) {
      tableRow.classList.add("inventoryAddHighlight");
    } else {
      tableRow.classList.remove("inventoryAddHighlight");
    }
  };

  const handleQuantityChange = (event, productId) => {
    const productQty = Number(event.target.value);
    if (productQty >= 0) {
      setProductList((prevState) =>
        prevState.map((product) =>
          product._id === productId ? { ...product, productQty } : product
        )
      );
    }
  };

  const handleSaveChanges = async (event) => {
    const token = localStorage.getItem("token");
    event.preventDefault(); // prevent default form submission behavior

    try {
      const selectedProducts = productList.filter(
        (product) => checkedMap[product._id]
      );
      const productsToAdd = selectedProducts.map((product) => ({
        productId: product._id,
        productQty: Number(product.productQty),
      }));

      if (selectedProducts.length === 0) {
        throw new Error("Please select at least one product.");
      }

      if (
        selectedProducts.filter((product) => product.productQty === undefined)
          .length > 0
      ) {
        throw new Error("Please add quantity for selected products.");
      }

      const response = await fetch(`/api/locations/${locationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ products: productsToAdd }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add products");
      }

      navigateBackToInventoryTable();
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const navigateBackToInventoryTable = () => {
    navigate("/adminlocation", {
      state: { locationName },
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    console.log("clear");
    fetchProducts();
  };

  const isSaveDisabled =
    !productList.some((product) => checkedMap[product._id]) || // check if at least one item is selected
    productList.some(
      (product) => checkedMap[product._id] && !product.productQty
    ); // check if all selected items have a quantity entered

  const filteredProductList = productList.filter((product) => {
    const productDetail = {
      _id: product._id,
      brand: product.brand,
      name: product.name,
    };
    const keyword = searchValue.trim().toLowerCase();
    return (
      productDetail._id.toLowerCase().trim().includes(keyword) ||
      productDetail.brand.toLowerCase().trim().includes(keyword) ||
      productDetail.name.toLowerCase().trim().includes(keyword)
    );
  });

  return (
    <div className="inventoryAdd">
      <h3 className="inventoryAddPageTitle">Add products to: {locationName}</h3>

      <div className="rowHeaderIA">
        <div className="wd-300-IA input-group input-group-sm">
          <span className="input-group-text">Search</span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Enter product name, id or brand"
            onChange={(e) => setSearchValue(e.target.value)}
          ></input>
        </div>
      </div>

      <form onSubmit={handleSaveChanges}>
        <table className="table tableIA">
          <thead>
            <tr className="inventoryAddHeader">
              <th>Select</th>
              <th>Product Name</th>
              <th>Product Id</th>
              <th>Product Brand</th>
              <th>Product Quantity</th>
            </tr>
          </thead>
          <tbody className="tableBodyIA">
            {filteredProductList.map((product) => (
              <tr key={product._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedMap[product._id]}
                    onChange={(event) =>
                      handleCheckboxChange(event, product._id)
                    }
                  />
                </td>
                <td>{product.name}</td>
                <td>{product._id}</td>
                <td>{product.brand}</td>
                <td>
                  <input
                    className="prodQuantityIA"
                    type="number"
                    min={0}
                    disabled={!checkedMap[product._id]}
                    value={product.productQty || ""}
                    onChange={(event) =>
                      handleQuantityChange(event, product._id)
                    }
                    placeholder={
                      checkedMap[product._id] ? "Enter quantity" : ""
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="controlButtonsIA">
          <button className="btn btn-danger" disabled={isSaveDisabled}>
            Add Product(s)
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Clear
          </button>
          <button
            className="btn btn-secondary"
            onClick={navigateBackToInventoryTable}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

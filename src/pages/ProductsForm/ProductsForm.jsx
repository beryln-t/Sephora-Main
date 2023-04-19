import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductsDeleteButton from "./ProductsDeleteButton";
import "./ProductsForm.css";

export default function ProductsForm({ products, delProduct }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    let filteredProductsCopy = [...products];

    if (searchTerm) {
      filteredProductsCopy = filteredProductsCopy.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p._id.toLowerCase().trim().includes(searchTerm.toLowerCase())
      );
    }
    setSortedProducts(filteredProductsCopy);
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="inventoryTablePF">
      <h3 className="productPortfolio">Product Portfolio</h3>
      <div className="contentPF">
        <div className="filterHeaderPF">
          <div className="rowHeaderProd">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Search</span>
              <input
                type="text"
                className="form-control search-input"
                id="searchProductInput"
                placeholder="Enter Product name, id, category or brand"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="addNewProduct">
              <Link to="/productpage/new">
                <button className="btn btn-dark">Add New Product</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="productsContentPF">
          <table className="table">
            <thead className="prodTableHead">
              <tr>
                <th scope="col">Product Name</th>
                <th scope="col">Product Id</th>
                <th scope="col">Product Price</th>
                <th scope="col">Product Category</th>
                <th scope="col">Product Brand</th>
                <th scope="col">Picture URL</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p._id}</td>
                  <td>${(p.price / 100).toFixed(2)}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td className="pictureUrl">{p.imgurl}</td>
                  <td className="actionsTableDataPF">
                    <Link to={`/productpage/products/${p._id}/edit`}>
                      <button className="btn btn-dark">Edit</button>
                    </Link>
                    <ProductsDeleteButton id={p._id} delProduct={delProduct} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

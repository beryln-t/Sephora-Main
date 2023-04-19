import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./products.css";

export default function ProductsPage({
  products,
  sortByCategory,
  category,
  setSortByCategory,
}) {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filteredProductsCopy = [...products];
    if (sortByCategory) {
      filteredProductsCopy = filteredProductsCopy.filter(
        (p) => p.category === sortByCategory
      );
    }
    if (sortByPrice === "lowToHigh") {
      filteredProductsCopy.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === "highToLow") {
      filteredProductsCopy.sort((a, b) => b.price - a.price);
    }
    if (searchTerm) {
      filteredProductsCopy = filteredProductsCopy.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSortedProducts(filteredProductsCopy);
  }, [searchTerm, sortByCategory, sortByPrice, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="products-page-container">
      <nav className="products-nav">
        <div className="filters-container">
          <div className="search-bar">
            <label>Search: </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search product or brand"
            />
          </div>
          <div className="sort-by-price">
            <label>Sort by Price: </label>
            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
            >
              <option value="">All Products</option>
              <option value="lowToHigh">Low to high</option>
              <option value="highToLow">High to low</option>
            </select>
          </div>
          <div className="sort-by-category">
            <label>Sort by categories: </label>
            <select
              value={sortByCategory}
              onChange={(e) => setSortByCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {category.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      <div className="card-columns">
        {sortedProducts.map((p) => (
          <div className="card" key={p._id}>
            <Link to={`/products/${p.name}`}>
              <img className="card-img-top" src={p.imgurl} alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.brand}</h5>
                <p className="card-text">{p.name}</p>
                <p className="card-text">
                  {(p.price / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "SGD",
                  })}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

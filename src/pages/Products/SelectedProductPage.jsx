import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./products.css";
export default function SelectedProductPage({ products }) {
  const { productName } = useParams();
  const [locationProduct, setLocationProduct] = useState([]);
  const product = products.filter((p) => p.name === productName);

  useEffect(() => {
    fetch(`/api/locations/${productName}`)
      .then((response) => response.json())
      .then((data) => setLocationProduct(data))
      .catch((error) => console.error(error));
  }, [productName]);

  return (
    <>
      <div className="page-container">
        <div className="d-flex justify-content-center align-items-center">
          {product.map((p) => (
            <div key={p._id} className="row">
              <div className="col-md-4">
                <img
                  className="productPic float-end"
                  src={p.imgurl}
                  alt={p.name}
                />
              </div>
              <div className="col-md-7">
                <div className="product-info">
                  <div className="product-brand">{p.brand}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">
                    {(p.price / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "SGD",
                    })}
                  </div>
                  <div className="product-description">
                    Description: {p.description}
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      View Availability
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Store Name</th>
                            <th>Availability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locationProduct.map((lp, i) => (
                            <tr key={i}>
                              <td>{lp.name}</td>
                              <td>
                                {lp.productQty > 0
                                  ? "Available"
                                  : "Not Available"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

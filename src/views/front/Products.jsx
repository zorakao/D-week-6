import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { currency } from "../../utils/filter.js";
import axios from "axios";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  const handleView = async (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3 d-flex" key={product.id}>
            <div className="card mb-3 flex-fill shadow-sm">
              <img
                src={product.imageUrl || "https://via.placeholder.com/300"}
                className="card-img-top"
                alt={product.title}
                style={{
                  height: "300px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <div className="mt-auto">
                  <p className="card-text">價格：{currency(product.price)}</p>
                </div>
                <p className="card-text">
                  <small className="text-body-secondary">
                    <span className="card-text">{product.unit}</span>
                  </small>
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleView(product.id)}
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { currency } from "../../utils/filter.js";
import axios from "axios";
import Swal from "sweetalert2";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  // const location = useLocation();
  // const product = location.state?.productData;

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`
        );
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleView(id);
  }, [id]);

  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "已加入購物車",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "加入失敗",
        text: error.response?.data?.message || "請稍後再試",
        timer: 2000,
      });
    }
  };

  return !product ? (
    <h2>查無產品</h2>
  ) : (
    <div className="container mt-3">
      <div className="card mb-3" style={{ width: "18rem" }}>
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
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">價格：{currency(product.price)}</p>
          <p className="card-text">
            <small className="text-body-secondary">
              <span className="card-text">{product.unit}</span>
            </small>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;

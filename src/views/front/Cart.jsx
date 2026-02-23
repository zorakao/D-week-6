import { useState, useEffect } from "react";
import { currency } from "../../utils/filter.js";
import axios from "axios";
import Swal from "sweetalert2";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const updateCart = async (cartId, productId, qty = 1) => {
    if (qty < 1) return;
    try {
      const data = {
        product_id: productId,
        qty: Number(qty),
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "數量已更新",
        showConfirmButton: false,
        timer: 1500,
      });
      getCart();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "更新失敗",
        text: error.response?.data?.message || "請稍後再試",
      });
    }
  };

  const delCart = async (cartId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "已成功刪除品項",
        showConfirmButton: false,
        timer: 1500,
      });
      getCart();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "刪除失敗",
        text: error.response?.data?.message || "請稍後再試",
      });
    }
  };

  const deleteAllCart = async () => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "已清空購物車",
        showConfirmButton: false,
        timer: 1500,
      });
      getCart();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "清空失敗",
        text: error.response?.data?.message || "請稍後再試",
      });
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={deleteAllCart}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCart(cartItem.id)}
                >
                  刪除
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={cartItem.qty}
                    onChange={(e) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value)
                      )
                    }
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Cart;

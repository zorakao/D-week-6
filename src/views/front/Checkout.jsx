import { useState, useEffect, useRef } from "react";
import { currency } from "../../utils/filter.js";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import {
  emailValidation,
  nameValidation,
  telValidation,
  addressValidation,
} from "../../utils/validation";
import axios from "axios";
import Swal from "sweetalert2";
import SingleProductModal from "../../components/SingleProductModal";
import * as bootstrap from "bootstrap";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    getProducts();
    getCart();
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(response.data.products);
      //   navigate(`/product/${id}`, {
      //     state: {
      //       productData: response.data.product,
      //     },
      //   });
    } catch (error) {
      console.log(error.response);
    }
  };

  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
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
      getCart();
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "加入失敗",
        text: error.response?.data?.message || "請稍後再試",
        timer: 2000,
      });
    } finally {
      setLoadingCartId(null);
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

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "已成功送出訂單",
        showConfirmButton: false,
        timer: 1500,
      });
      getCart();
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "送出訂單失敗",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`
      );
      setProduct(response.data.product);
      productModalRef.current.show();
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "4px",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{currency(product.origin_price)}</del>
                <div className="h5">特價：{currency(product.price)}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines
                        visible={true}
                        height="16"
                        width={80}
                        strokeColor="grey"
                        strokeWidth="5"
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <RotatingLines
                        visible={true}
                        height="16"
                        width={80}
                        strokeColor="grey"
                        strokeWidth="5"
                      />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test@gamil.com"
              {...register("email", emailValidation)}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="小明"
              {...register("name", nameValidation)}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register("tel", telValidation)}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺北市信義區信義路5段7號"
              {...register("address", addressValidation)}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}

export default Checkout;

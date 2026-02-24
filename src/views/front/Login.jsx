import { useState } from "react";
import { useForm } from "react-hook-form";
import { emailValidation, passwordValidation } from "../../utils/validation";
import axios from "axios";
import Swal from "sweetalert2";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    let response;
    try {
      response = await axios.post(`${API_BASE}/admin/signin`, formData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "請檢查帳號或密碼",
      });
      return;
    }

    if (!response.data.success) {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: response.data.message || "帳密錯誤",
      });
      return;
    }

    const { token, expired } = response.data;
    document.cookie = `hexToken=${token}; expires=${new Date(
      expired
    ).toUTCString()}; path=/`;
    axios.defaults.headers.common.Authorization = token;

    if (typeof setIsAuth === "function") setIsAuth(true);

    Swal.fire({
      position: "center",
      icon: "success",
      title: "登入成功",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="name@product.com"
            {...register("username", emailValidation)}
          />
          <label htmlFor="username">Email address</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="input-group mb-3">
          <div className="form-floating">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              {...register("password", passwordValidation)}
            />
            <label>Password</label>
          </div>

          <span
            className="input-group-text"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            <i
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
            />
          </span>
        </div>
        {errors.password && (
          <p className="text-danger mb-0">{errors.password.message}</p>
        )}
        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={!isValid}
        >
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;

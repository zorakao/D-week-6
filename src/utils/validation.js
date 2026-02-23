export const emailValidation = {
  required: "請輸入 Email",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  },
};

export const passwordValidation = {
  required: "請輸入密碼",
  minLength: {
    value: 6,
    message: "密碼長度至少需 6 碼",
  },
};

export const nameValidation = {
  required: "請輸入姓名",
  minLength: {
    value: 2,
    message: "姓名最少 2 個字",
  },
};

export const telValidation = {
  required: "請輸入電話",
  pattern: {
    value: /^\d+$/,
    message: "電話僅能輸入數字",
  },
  minLength: {
    value: 8,
    message: "電話最少 8 碼",
  },
};

export const addressValidation = {
  required: "請輸入地址",
};

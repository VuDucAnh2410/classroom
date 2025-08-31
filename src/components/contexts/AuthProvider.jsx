import React, { createContext, useEffect, useState } from "react";

export const LoginContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("isLogin");
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  const handelLogin = (user) => {
    localStorage.setItem("isLogin", JSON.stringify(user));
    setAuth(user);
  };

  const handleLogout = () => {
    // Xóa thông tin khỏi localStorage
    localStorage.removeItem("isLogin");
    // Cập nhật state về null
    setAuth(null);
  };

  return (
    <LoginContext.Provider value={{ auth, handelLogin, handleLogout }}>
      {children}
    </LoginContext.Provider>
  );
}

export default AuthProvider;

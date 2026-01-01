import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [reloginCode, setReloginCode] = useState(localStorage.getItem("RE_LOGIN_CODE"))

  const loginSuccess = (user, code) => {
    setUser(user);
    setIsAuth(true);
    setReloginCode(code)
    localStorage.setItem("USER", user);
    localStorage.setItem("RE_LOGIN_CODE", code);
  };

  const logout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, isAuth,reloginCode, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

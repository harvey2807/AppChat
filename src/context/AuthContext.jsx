import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [reloginCode, setReloginCode] = useState(null);

  // Restore session khi reload
  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    const storedCode = localStorage.getItem("RE_LOGIN_CODE");

    if (storedUser && storedCode) {
      setUser(storedUser);
      console.log("Restored user from localStorage:", storedUser);
      // console.log("Type of function reloginCode:", typeof setReloginCode(storedCode));
      setReloginCode(storedCode);
      // setReloginCode(storedCode);
      setIsAuth(true);
    }
  }, []);

  const loginSuccess = (user, code) => {
    setUser(user);
    setIsAuth(true);
    console.log("Login success for user:", typeof setIsAuth(true));
    console.log("Relogin code set to:", code);
    setReloginCode(code);

    localStorage.setItem("USER", user);
    localStorage.setItem("RE_LOGIN_CODE", code);
  };

  const logout = () => {
    setUser(null);
    setIsAuth(false);
    setReloginCode(null);
    //why clear local storage here
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        reloginCode,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

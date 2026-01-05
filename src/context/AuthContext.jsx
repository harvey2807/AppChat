import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [reloginCode, setReloginCode] = useState(null);
  const [dstUser, setDstUser] = useState("");
  const [dstRoom, setDstRoom] = useState("");

  // Restore session khi reload
  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    const storedCode = localStorage.getItem("RE_LOGIN_CODE");

    if (storedUser && storedCode) {
      setUser(storedUser);
      setReloginCode(storedCode);
      setIsAuth(true);
    }
  }, []);

  const loginSuccess = (user, code) => {
    setUser(user);
    setIsAuth(true);
    setReloginCode(code);

    localStorage.setItem("USER",user);
    localStorage.setItem("RE_LOGIN_CODE", code);
  };

  const logout = () => {
    setUser(null);
    setIsAuth(false);
    setReloginCode(null);
    localStorage.clear();
  };

  const chatWithUser = (username) => {
    setDstUser(username);
    setDstRoom("");
  };

  const chatInRoom = (roomName) => {
    setDstRoom(roomName);
    setDstUser("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        reloginCode,
        loginSuccess,
        logout,
        dstUser,
        dstRoom
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

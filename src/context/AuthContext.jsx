import { createContext, useState, useContext, useEffect, useRef } from "react";

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
      console.log("Restored session from localStorage:");
    }
  }, []);

  const loginSuccess = (user, code) => {
    setIsAuth(true)
    setUser(user);
    setReloginCode(code);
    console.log("Login success, storing user and code in localStorage:", user, code);
    localStorage.setItem("USER", user);

    localStorage.setItem("RE_LOGIN_CODE", code);
    localStorage.setItem("CHATLIST", []);
  };

  const logout = () => {
    setUser(null);
    setReloginCode(null);
    //why clear local storage here
    setIsAuth(false);
    console.log("Logging out, clearing localStorage");
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
        chatWithUser,
        chatInRoom,
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

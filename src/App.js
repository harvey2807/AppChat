import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsersationLayout from './layout/ConsersationLayout.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate, replace } from 'react-router-dom';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import { useAuth } from './context/AuthContext.jsx';
import PrivateRoute from './context/PrivateRouter.jsx';


function App() {
  const { isAuth } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/app" replace /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <ConsersationLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

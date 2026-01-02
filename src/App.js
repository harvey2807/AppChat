import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/chat/sidebar/sidebar.jsx';
import ConsersationLayout from './layout/ConsersationLayout.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate, replace } from 'react-router-dom';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<ConsersationLayout />} />
      </Routes>
    </Router>
  );
}

export default App;

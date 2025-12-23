import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/chat/sidebar/sidebar.jsx';
import ConsersationLayout from './layout/ConsersationLayout.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login.jsx';
function App() {
  return (
    // <div className="App">
    //   {/* <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header> */}
    //   <Sidebar />
    // </div>
    // <ConsersationLayout></ConsersationLayout>
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ConsersationLayout />} />
        </Routes>
    </Router>
  );
}

export default App;

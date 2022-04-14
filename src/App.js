import './App.css';
import Banks from "./components/banks";
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './components/traces/admin';
import Login from './components/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/banks' element={<Banks />} />
          <Route path='/system' element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;

import './App.css';
import Banks from "./components/banks/banks";
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './components/traces/admin';
import Login from './components/login';
import Logout from './components/logout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Countries from './components/countries/countries';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/login/:id' element={<Login />} />
          <Route path='/banks' element={<Banks />} />
          <Route path='/countries' element={<Countries />} />
          <Route path='/system' element={<Admin />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<h2 className='p-5'>Not found</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;

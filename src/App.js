import './App.css';
import Banks from "./components/banks";
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './components/traces/admin';
import Home from './components/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/login' element={<Home />} />
          <Route path='/banks' element={<Banks />} />
          <Route path='/system' element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;

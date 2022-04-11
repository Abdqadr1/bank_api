import './App.css';
import Banks from "./components/banks";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar';
import Admin from './components/traces/admin';
import Login from './components/login';

function App() {
  return (
    <div className="App">
      <Login/>
      <NavBar />
      <Admin />
      <Banks />
    </div>
  );
}

export default App;

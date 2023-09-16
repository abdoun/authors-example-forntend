import './App.css';
import {useState} from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import {Nav, Container} from 'react-bootstrap';
import Login from './Components/Login';
import Authors from './Components/Authors';
import Home from './Components/Home';


function App() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Aurhors example
        </h1>
        <Nav variant='pills'>
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/authors">Authors</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        </Nav>
        
      </header>
      <Container>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/authors" element={ <Authors/> } />
          <Route path="/login" element={ <Login/> } />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

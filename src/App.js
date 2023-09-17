import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import {Nav, Container} from 'react-bootstrap';
import Login from './Components/Login';
import Authors from './Components/Authors';
import Home from './Components/Home';
import useToken from './Components/useToken';

function App() {
  const { token, setToken } = useToken();

  console.log('app token: ' + token);
  /* if(!token) {
    return <Login setToken={setToken} />
  } */
  const access_token = localStorage.getItem('token');
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
            <Nav.Link href="/login">{access_token != 'null' || access_token == null ? 'Logout' : 'login'}</Nav.Link>
          </Nav.Item>
        </Nav>
        
      </header>
      <Container>        
        {access_token == 'null' || access_token == null ? <Login setToken={setToken} /> : 
        <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/authors" element={ <Authors/> } />
        <Route path="/login" element={ <Login setToken={setToken} /> } />
      </Routes>
      }
      </Container>
    </div>
  );
}

export default App;

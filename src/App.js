import './App.css';
import { useState } from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import {Nav, Container} from 'react-bootstrap';
import Login from './Components/Login';
import Authors from './Components/Authors';
import Home from './Components/Home';
import DemoNotice from './Components/DemoNotice';
import PrivacyPolicy from './Components/PrivacyPolicy';
import useToken from './Components/useToken';

function App() {
  const { token, setToken } = useToken();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Authors example
        </h1>
        <Nav variant='pills'>
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/authors">Authors</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login">{token ? 'Logout' : 'Login'}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as="button" onClick={() => setShowPrivacy(true)}>Privacy</Nav.Link>
          </Nav.Item>
        </Nav>
      </header>
      <Container>
        <DemoNotice onOpenPrivacy={() => setShowPrivacy(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authors" element={!token ? <Login setToken={setToken} /> : <Authors />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </Container>
      <PrivacyPolicy show={showPrivacy} onHide={() => setShowPrivacy(false)} />
    </div>
  );
}

export default App;

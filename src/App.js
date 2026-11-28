import './App.css';
import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import {Alert, Nav, Container} from 'react-bootstrap';
import Authors from './Components/Authors';
import Home from './Components/Home';
import DemoNotice from './Components/DemoNotice';
import PrivacyPolicy from './Components/PrivacyPolicy';
import { USER_AUTH_URL } from './config';
import useToken from './Components/useToken';

function AccountRedirect({ url }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <div className="loading-message">
      Redirecting to your account... If nothing happens,{' '}
      <a href={url}>click here</a>.
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const accountUrl = `${USER_AUTH_URL}${token ? '/profile' : '/login'}`;

  const handleLogout = () => {
    setToken(null);
    setLoggedOut(true);
    navigate('/');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-brand">Authors example</h1>
        <Nav variant='pills' className="App-nav">
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/authors">Authors</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href={accountUrl}>Account</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as="button" onClick={() => setShowPrivacy(true)}>Privacy</Nav.Link>
          </Nav.Item>
          {token && (
            <Nav.Item className="ms-auto">
              <Nav.Link as="button" onClick={handleLogout}>Logout</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </header>
      <Container>
        {loggedOut && (
          <Alert variant="success" dismissible onClose={() => setLoggedOut(false)}>
            You have been logged out.
          </Alert>
        )}
        <DemoNotice onOpenPrivacy={() => setShowPrivacy(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/authors"
            element={token ? <Authors /> : <AccountRedirect url={`${USER_AUTH_URL}/login`} />}
          />
          <Route path="/login" element={<AccountRedirect url={accountUrl} />} />
        </Routes>
      </Container>
      <footer className="App-footer">
        <span>Authors Example · demo application — test data only</span>
        <span className="d-flex gap-3">
          <a href={accountUrl}>Account</a>
          <button type="button" onClick={() => setShowPrivacy(true)}>Privacy policy</button>
        </span>
      </footer>
      <PrivacyPolicy show={showPrivacy} onHide={() => setShowPrivacy(false)} />
    </div>
  );
}

export default App;

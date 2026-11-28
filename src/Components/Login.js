import React, { useState, useEffect, useRef } from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearSharedToken } from './sharedToken';
import { AUTH_API_URL, REGISTER_URL } from '../config';

async function loginUser(credentials) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || 'Login failed');
  }

  return data.token ?? null;
}


const Login = ({setToken}) => {
  const navigate = useNavigate();
  const redirectTimer = useRef(null);
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [error, setError] = useState(null);
  let [success, setSuccess] = useState(false);
  let [loggedOut, setLoggedOut] = useState(false);

  // Visiting /login while signed in logs out, but a fresh login must not be
  // cleared by this check on the following re-render.
  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      localStorage.removeItem('token');
      clearSharedToken();
      setLoggedOut(true);
      window.location.replace('/');
    }
  }, []);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const token = await loginUser({
        email,
        password
      });
      if (!token) {
        throw new Error('Login failed: the server did not return a token');
      }
      setToken(token);
      setSuccess(true);
      redirectTimer.current = setTimeout(() => navigate('/authors'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loggedOut) {
    return <Alert variant='success'>Logout</Alert>
  }
  return (
  <>
    {error && (
      <Alert variant='danger' className="login-error">
        <Alert.Heading className="h6 mb-1">Couldn't sign in</Alert.Heading>
        <p className="mb-1">{error}</p>
        {!error.includes('Too many login attempts') && (
          <p className="mb-0 small">
            Don't have an account?{' '}
            <a href={REGISTER_URL}>
              Register in user-auth-react
            </a>
          </p>
        )}
      </Alert>
    )}
    {success && (
      <Alert variant='success' className="login-success">
        <Alert.Heading className="h6 mb-1">Login successful</Alert.Heading>
        <p className="mb-1">You are signed in. Taking you to the Authors page...</p>
        <p className="mb-0 small">
          <a href="/authors">Go to Authors now</a>
          {' · '}
          <a href="/">Go to Home</a>
        </p>
      </Alert>
    )}
    {!success && <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>}
  </>
  );
};
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };

export default Login;

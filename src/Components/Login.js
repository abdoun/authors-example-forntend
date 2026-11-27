import React, { useState, useEffect } from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { clearSharedToken } from './sharedToken';
import { AUTH_API_URL } from '../config';

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
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [error, setError] = useState(null);
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


  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const token = await loginUser({
        email,
        password
      });
      setToken(token);
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
      <Alert variant='danger'>
        <div>{error}</div>
        {!error.includes('Too many login attempts') && (
          <div className="mt-2">
            Don't have an account?{' '}
            <a href={`http://${window.location.hostname}:8083/register`}>
              Register in user-auth-react
            </a>
          </div>
        )}
      </Alert>
    )}
    <Form onSubmit={handleSubmit}>
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
      </Form>
  </>
  );
};
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };

export default Login;

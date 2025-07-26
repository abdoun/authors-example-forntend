import React, { useState } from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
    
    return fetch('http://authors-backend/api/login?email=' + credentials.email + '&password=' + credentials.password, {
        method: "GET",
      })
    .then(response => response.json())
    .then(data => data.api_key ?? null)
   }

   
const Login = ({setToken}) => {
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();
    

    
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          email,
          password
        });
        setToken(token);
        console.log('token: '+token);
 
      }
      console.log('local token: ' + localStorage.getItem('token'));
    if(localStorage.getItem('token') != null && localStorage.getItem('token') != 'null') {
      localStorage.removeItem('token');
      
      window.location.replace('/');
      return <Alert variant='success'>Logout</Alert>
    }
    return (
    <>    
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
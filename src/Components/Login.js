import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';

// GET request using fetch with error handling
fetch('http://localhost/authors/public/', {
  method: "GET",
  mode: "cors"
})
.then(async response => {
    const data = await response.json();
    console.log(data);
    // check for error response
    if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        console.error(data);
        return Promise.reject(error);
    }

})
.catch(error => {
    //this.setState({ errorMessage: error.toString() });
    console.error('There was an error!', error);
});




async function loginUser(credentials) {
    
    return fetch('http://localhost/authors/public/api/login?email=' + credentials.email + '&password=' + credentials.password, {
        method: "GET",
        mode: "cors"
      })
    .then(response => response.json())
    .then(data => data.api_key)
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
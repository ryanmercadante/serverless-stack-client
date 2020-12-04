import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../libs/contextLib';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';

import './Login.css';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const [fields, setFields] = useFormFields({
    email: '',
    password: '',
  });
  const { setIsAuthenticated } = useAppContext();
  const history = useHistory();

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      setIsAuthenticated(true);
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className='Login'>
      <Form onSubmit={handleSubmit}>
        <Form.Group size='lg' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type='email'
            value={fields.email}
            onChange={setFields}
          />
        </Form.Group>
        <Form.Group size='lg' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={fields.password}
            onChange={setFields}
          />
        </Form.Group>
        <LoaderButton
          block
          size='lg'
          type='submit'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}

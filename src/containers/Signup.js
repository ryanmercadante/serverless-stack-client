import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { useFormFields } from '../libs/hooksLib';

import './Signup.css';
import { onError } from '../libs/errorLib';

export default function Signup() {
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { setIsAuthenticated } = useAppContext();
  const [fields, setFields] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });

  function validateForm() {
    const { email, password, confirmPassword } = fields;
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (err) {
      onError(err);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      setIsAuthenticated(true);
      history.push('/');
    } catch (err) {
      onError(err);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId='confirmationCode' size='lg'>
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type='tel'
            onChange={setFields}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size='lg'
          type='submit'
          variant='success'
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='email' size='lg'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type='email'
            value={fields.email}
            onChange={setFields}
          />
        </Form.Group>
        <Form.Group controlId='password' size='lg'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={fields.password}
            onChange={setFields}
          />
        </Form.Group>
        <Form.Group controlId='confirmPassword' size='lg'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            onChange={setFields}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size='lg'
          type='submit'
          variant='success'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className='Signup'>
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}

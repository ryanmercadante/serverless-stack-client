import { Redirect, Route } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';

export default function UnauthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated } = useAppContext();

  return (
    <Route {...rest}>{!isAuthenticated ? children : <Redirect to='/' />}</Route>
  );
}

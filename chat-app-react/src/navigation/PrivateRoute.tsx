import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuthenticated = () => {
  return !!localStorage.getItem('auth');
};

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;

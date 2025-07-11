import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user } = useSession();

  return (
    <Route
      {...rest}
      render={props => 
        isAuthenticated && user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
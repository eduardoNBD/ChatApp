import React, { useState, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
     
    if (!accessToken || !refreshToken) {
      setIsValidating(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      // Intentar validar el access token
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setIsAuthenticated(true);
      } else if (response.status === 403) {
        // Token expirado, intentar refrescar
        const refreshResponse = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('accessToken', data.accessToken);
          setIsAuthenticated(true);
        } else { 
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error validando token:', error);
      setIsAuthenticated(false);
    }

    setIsValidating(false);
  };

  if (isValidating) { 
    return <div>Cargando...</div>;
  }

  return (
    <Route
      {...rest}
      render={props => 
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Component {...props} />
          //<Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
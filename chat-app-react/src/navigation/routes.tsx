import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import NoAuthLayout from './layouts/NoAtuhLayout';
import ChatLayout from './layouts/ChatLayout';
import Login from '../pages/Login';

const RoutesApp = () => (
  <Switch> 
    <Route path="/login" component={NoAuthLayout} /> 
    <PrivateRoute path="/" component={ChatLayout} />
  </Switch>
);

export default RoutesApp;

import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '@navigation/PrivateRoute';  
import Login from '@pages/Login';
import Home from '@pages/Home';

const RoutesApp = () => (
  <Switch> 
    <Route path="/login" component={Login} /> 
    <PrivateRoute path="/" component={Home} />
  </Switch>
);

export default RoutesApp;

import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <main>
        <Switch>
          <Route exact path="/" render={() => <div>Home Page</div>} />
          <Route path="/chat" render={() => <div>Chat Page</div>} />
        </Switch>
      </main>
    </div>
  );
};

export default Layout;
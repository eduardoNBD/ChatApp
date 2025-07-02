import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import RoutesApp from '@navigation/routes';
import './index.css';

/* Theme variables */
import '@theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <RoutesApp />
    </IonReactRouter>
  </IonApp>
);

export default App;

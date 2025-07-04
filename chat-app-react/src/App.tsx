import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import RoutesApp from '@navigation/routes';
import { AlertProvider } from "@components/AlertContext";

import './index.css';

/* Theme variables */
import '@theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <AlertProvider>
    <IonApp>
      <IonReactRouter>
        <RoutesApp />
      </IonReactRouter>
    </IonApp>
  </AlertProvider>
);

export default App;

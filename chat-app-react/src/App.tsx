import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import RoutesApp from '@navigation/routes';
import { AlertProvider } from "./contexts/AlertContext";
import { SessionProvider } from "./contexts/SessionContext";

import './index.css';

/* Theme variables */
import '@theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <SessionProvider>
    <AlertProvider>
      <IonApp>
        <IonReactRouter>
          <RoutesApp />
        </IonReactRouter>
      </IonApp>
    </AlertProvider>
  </SessionProvider>
);

export default App;

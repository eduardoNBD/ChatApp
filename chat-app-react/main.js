import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Cargar la aplicación React
  console.log('Entorno:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    // Modo desarrollo: carga desde el servidor local de Vite
    mainWindow.loadURL('http://localhost:5173'); // Puerto predeterminado de Vite
    mainWindow.webContents.openDevTools(); // Abrir DevTools para depuración
  } else {
    // Modo producción: carga el archivo index.html generado por Vite
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
import * as React from 'react';
import { useState } from 'react';
import NoAuthLayout from '@navigation/layouts/NoAtuhLayout';

const Login = ({ onLogin }: { onLogin?: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (username && password) {
      setError('');
      if (onLogin) onLogin();
    } else {
      setError('Usuario y contraseña requeridos');
    }
  };

  return ( 
    <NoAuthLayout>
      <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
        <h2  class="bg-red-500">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </NoAuthLayout>
  );
};

export default Login; 
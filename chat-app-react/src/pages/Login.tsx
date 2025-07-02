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
        <h2 className="bg-blue-600 underline">Iniciar sesión</h2>  
        <div className="flex gap-2 bg-gray-100 p-4">
  <div className="bg-blue-500 text-white p-2">A</div>
  <div className="bg-red-500 text-white p-2">B</div>
</div>
        <form onSubmit={handleSubmit}>
          <div className="flex fg">
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
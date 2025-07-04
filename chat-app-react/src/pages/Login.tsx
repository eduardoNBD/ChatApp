import * as React from 'react';
import { useState } from 'react';
import NoAuthLayout from '@navigation/layouts/NoAuthLayout'; 

const Login = () => {
  const [form, setForm] = useState({
    username: '', 
    password: '', 
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();  
    setErrors({});

    try { 
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        const data = await response.json();
 
        if (typeof data.message == "object") {
          setErrors(data.message); 
        } else {
          setErrors(data);
        }
        return;
      } 
    } catch (error) {
      setErrors({message:'Error de conexión: '+error});
    }
  };

  return ( 
    <NoAuthLayout title="Login" description='Login'> 
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"> 
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Iniciar sesión
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div className='mb-2'>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario o E-Mail</label>
                            <input type="text" value={form.username} onChange={handleChange} name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""/>
                            {errors.username && <i id="error_username" className='ml-2 text-red-500 text-sm'>{errors.username}</i>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                            <input type="password"  value={form.password} onChange={handleChange} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            {errors.password && <i id="error_password" className='ml-2 text-red-500 text-sm'>{errors.password}</i>}
                        </div>
                        <hr className='my-6'/>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"/>
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Recuerdame</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">¿Olvidaste tu contraseña?</a>
                        </div>
                        {errors.message && <div className='text-center h-auto mb-2'>
                          <i className='ml-2 text-red-500 text-sm'>{errors.message}</i>
                        </div>}
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Entrar</button> 
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            ¿No tienes cuenta aun? <a href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Registrate</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
      </section>
    </NoAuthLayout>
  );
};

export default Login; 
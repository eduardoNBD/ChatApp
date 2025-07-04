import * as React from 'react';
import { useState } from 'react';
import NoAuthLayout from '@navigation/layouts/NoAuthLayout'; 
import { useAlert } from "@components/AlertContext";
import { useHistory } from "react-router-dom";

const Register = () => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { showAlert } = useAlert();
    const [form, setForm] = useState({
        username: '', 
        email: '', 
        password: '', 
        confirm_password: '', 
    }); 
 
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
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/api/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.message == "object") { 
          setErrors(data.message);
        } else {
          setErrors(data);
        }

        return;
      } 

      showAlert(data.message);

      setTimeout(() => {
        const history = useHistory();
        history.push("/login");
      }, 500);
    } catch (error) {
        setErrors({message:'Error de conexión: '+error});
    }
  };

  return ( 
    <NoAuthLayout title="Registro" description='Registro'> 
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"> 
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                        Registrate
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div className='mb-2'>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario</label>
                            <input type="text" value={form.username} onChange={handleChange} name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Usuario"/>
                            {errors.username && <i id="error_username" className='ml-2 text-red-500 text-sm'>{errors.username}</i>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-Mail</label>
                            <input type="text" value={form.email} onChange={handleChange} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E-Mail"/>
                            {errors.email && <i id="error_username" className='ml-2 text-red-500 text-sm'>{errors.email}</i>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                            <input type="password"  value={form.password} onChange={handleChange} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            {errors.password && <i id="error_password" className='ml-2 text-red-500 text-sm'>{errors.password}</i>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar contraseña</label>
                            <input type="password"  value={form.confirm_password} onChange={handleChange} name="confirm_password" id="confirm_password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            {errors.confirm_password && <i id="error_password" className='ml-2 text-red-500 text-sm'>{errors.confirm_password}</i>}
                        </div>
                        <hr className='my-6'/> 
                        {errors.message && <div className='text-center h-auto mb-2'>
                          <i className='ml-2 text-red-500 text-sm'>{errors.message}</i>
                        </div>}
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Registrate</button> 
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            ¿Ya estas registrado? <a href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Inicia Sesión</a>
                        </p>
                    </form>
                </div>
            </div>
        </div> 
      </section>
    </NoAuthLayout>
  );
};

export default Register; 
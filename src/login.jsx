import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(''); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Resetear mensajes de error
    
    // Validación simple
    if (!user.username || !user.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const resData = await response.json();
      document.cookie = `token=${resData.accessToken}; path=/; secure; samesite=strict`;
      console.log('Token guardado en la cookie:', resData.accessToken);

      // Manejo de roles
      if (resData.roles && resData.roles.length > 0) {
        const role = resData.roles[0]; // Tomamos el primer rol por simplicidad
        let endpoint = '';
        if (role === 'ROLE_ADMIN') endpoint = 'admin';
        else if (role === 'ROLE_USER') endpoint = 'user';

        const testRes = await fetch(`${apiUrl}/api/test/${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${resData.accessToken}`,
          },
        });

        if (testRes.ok) {
          const responseData = await testRes.json();
          
          const message = responseData.message;
          navigate(`/dashboard?message=${encodeURIComponent(message)}&role=${role}`);
        } else {
          setError('No tienes permisos para acceder');
        }
      } else {
        setError('Usuario sin roles asignados');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setError(error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegisterRedirect = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Iniciar sesión</h2>
        <p>Usuario admin: <strong>abner</strong></p>
        <p>Contraseña: <strong>123456</strong></p>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.inputLabel}>Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Ingresa tu usuario"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.inputLabel}>Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Iniciar sesión
          </button>
          <button 
            onClick={handleRegisterRedirect} 
            className={styles.registerButton}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';

function Register() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validación básica
    if (!user.username || !user.email || !user.password) {
      setError('Todos los campos son obligatorios');
      setIsSubmitting(false);
      return;
    }

    if (user.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar');
      }

      console.log('Registro exitoso:', result);
      navigate('/', { state: { registrationSuccess: true } });
    } catch (error) {
      console.error('Error al registrar:', error);
      setError(error.message || 'Error en el registro. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2 className={styles.registerTitle}>Crear cuenta</h2>
        
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
            placeholder="Ej: usuario123"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.inputLabel}>Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Ej: correo@ejemplo.com"
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
            placeholder="Mínimo 6 caracteres"
          />
          <p className={styles.passwordHint}>La contraseña debe tener al menos 6 caracteres</p>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={styles.registerSubmitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
          <button 
            onClick={handleLoginRedirect} 
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
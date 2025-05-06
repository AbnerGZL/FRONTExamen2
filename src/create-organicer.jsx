import { useState } from 'react';
import styles from './Formularios.module.css'; // Mismo archivo CSS

const FormOrganizador = () => {
  const apiUrl = process.env.URI;
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const home = () => {
    window.history.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/organizador/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Organizador agregado correctamente ✅');
        setNombre('');
      } else {
        setMensaje(`Error: ${data.message} ❌`);
      }
    } catch (error) {
      setMensaje(`Error de conexión: ${error.message} ❌`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Agregar Organizador</h2>
        
        {mensaje && (
          <div className={mensaje.includes('✅') ? styles.successMessage : styles.errorMessage}>
            {mensaje}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre" className={styles.formLabel}>Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.primaryButton}>
              Agregar
            </button>
            <button type="button" onClick={home} className={styles.secondaryButton}>
              Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormOrganizador;
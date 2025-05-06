import { useEffect, useState } from 'react';
import styles from './Formularios.module.css';

export default function CrearEvento() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const home = () => {
    window.history.back();
  };

  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    lugar: '',
    imagen: '',
    organizador_id: '',
  });

  const [organizadores, setOrganizadores] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}/api/organizadores`)
      .then(res => res.json())
      .then(data => setOrganizadores(data))
      .catch(err => console.error('Error al cargar organizadores:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/evento/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al crear el evento');

      const data = await res.json();
      console.log('Evento creado:', data);
      setMensaje('Evento creado correctamente ✅');
      setFormData({
        nombre: '',
        fecha: '',
        lugar: '',
        imagen: '',
        organizador_id: '',
      });
    } catch (error) {
      console.error('Error al crear evento:', error);
      setMensaje('Error al crear el evento ❌');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Crear nuevo evento</h2>
        
        {mensaje && (
          <div className={mensaje.includes('✅') ? styles.successMessage : styles.errorMessage}>
            {mensaje}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Lugar:</label>
            <input
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Imagen (URL):</label>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Organizador:</label>
            <select
              name="organizador_id"
              value={formData.organizador_id}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              <option value="">Seleccione un organizador</option>
              {organizadores.map(org => (
                <option key={org.id} value={org.id}>
                  {org.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.primaryButton}>
              Crear evento
            </button>
            <button type="button" onClick={home} className={styles.secondaryButton}>
              Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
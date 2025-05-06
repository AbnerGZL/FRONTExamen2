import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Formularios.module.css'; // Mismo archivo CSS compartido

const EditOrganizadorForm = () => { 
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState('');
    
    const home = () => {
        window.history.back();
    };    

    useEffect(() => {
        fetch(`${apiUrl}/api/organizador/${id}`)
            .then(res => res.json())
            .then(data => setNombre(data.nombre))
            .catch(error => setMensaje('Error al cargar organizador ❌'));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiUrl}/api/organizador/edit/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje('Organizador editado correctamente ✅');
            } else {
                setMensaje(data.message || 'Error al editar organizador ❌');
            }
        } catch (error) {
            setMensaje('Error de conexión con el servidor ❌');
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Editar Organizador</h2>
                
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
                            Guardar cambios
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

export default EditOrganizadorForm;
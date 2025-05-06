import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Formularios.module.css'; // Mismo archivo CSS

const EditEventoForm = () => {
    const apiUrl = process.env.URI;
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [lugar, setLugar] = useState('');
    const [imagen, setImagen] = useState('');
    const [organizadorId, setOrganizadorId] = useState('');
    const [organizadores, setOrganizadores] = useState([]);
    const [mensaje, setMensaje] = useState('');
    
    const home = () => {
        window.history.back();
    };

    useEffect(() => {
        // Cargar datos del evento
        fetch(`${apiUrl}/api/evento/${id}`)
            .then(res => res.json())
            .then(data => {
                setNombre(data.nombre);
                setFecha(data.fecha.split('T')[0]);
                setLugar(data.lugar);
                setImagen(data.imagen || '');
                setOrganizadorId(data.organizador_id);
            })
            .catch(() => setMensaje('Error al cargar evento ❌'));

        // Cargar organizadores
        fetch(`${apiUrl}/api/organizadores`)
            .then(res => res.json())
            .then(data => setOrganizadores(data))
            .catch(() => setMensaje('Error al cargar organizadores ❌'));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiUrl}/api/evento/edit/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre, 
                    fecha, 
                    lugar, 
                    imagen, 
                    organizador_id: organizadorId 
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje('Evento editado correctamente ✅');
            } else {
                setMensaje(data.message || 'Error al editar evento ❌');
            }
        } catch (error) {
            setMensaje('Error de conexión con el servidor ❌');
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Editar Evento</h2>
                
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
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Fecha:</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Lugar:</label>
                        <input
                            type="text"
                            value={lugar}
                            onChange={(e) => setLugar(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Imagen (URL):</label>
                        <input
                            type="text"
                            value={imagen}
                            onChange={(e) => setImagen(e.target.value)}
                            className={styles.formInput}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Organizador:</label>
                        <select
                            value={organizadorId}
                            onChange={(e) => setOrganizadorId(e.target.value)}
                            className={styles.formSelect}
                            required
                        >
                            <option value="">Selecciona un organizador</option>
                            {organizadores.map((org) => (
                                <option key={org.id} value={org.id}>{org.nombre}</option>
                            ))}
                        </select>
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

export default EditEventoForm;
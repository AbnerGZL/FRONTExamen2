import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Dashboard.module.css';

function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const [eventos, setEventos] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);

  const [role, setRole] = useState('');

  const navigate = useNavigate();
  const irAEditarOrganizador = (id) => {
    navigate(`/organicer/edit/${id}`);
  };
  const editarEvento = (id) => {
    navigate(`/event/edit/${id}`);
  };
  const agregarOrg = () => {
    navigate(`/organicer/add`);
  };
  const agregarEv = () => {
    navigate(`/evento/add`);
  };
  const handleDeleteOrganizador = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/organizadores/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar organizador: ${response.status}`);
      }
  
      // Actualizamos la lista sin el organizador eliminado
      setOrganizadores(prev => prev.filter(org => org.id !== id));
    } catch (error) {
      console.error('Error al eliminar organizador:', error);
    }
  };

  const handleDeleteEvento = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/eventos/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar evento: ${response.status}`);
      }
  
      setEventos(prev => prev.filter(evento => evento.id !== id));
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };
  

  useEffect(() => {
    const msg = searchParams.get('message');
    const role = searchParams.get('role');
    setRole(role);

    const fetchEventos = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/eventos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setEventos(data);
        console.log(data);
      } catch (error) {
        console.error('Ocurrió un error al obtener los eventos:', error);
      }
    };

    const fetchOrganizadores = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/organizadores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
    
        const data = await response.json();
        setOrganizadores(data);
      } catch (error) {
        console.error('Ocurrió un error al obtener los organizadores:', error);
      };
    };

    if (role === 'ROLE_USER') {
      fetchEventos();
    };

    if (role === 'ROLE_ADMIN') {
      fetchEventos();
      fetchOrganizadores();
    }

    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
    }, {});
    if (!cookies.token) {
        navigate('/');
      }
    if (msg) {
      setMessage(decodeURIComponent(msg));
    }
  }, [searchParams]);

  const handleLogout = (e) => {
    e.preventDefault();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
    navigate('/');
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Panel de Control</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            <path fillRule="evenodd" d="M10.146 8.354a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 11.293l2.646-2.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          Cerrar sesión
        </button>
      </header>

      <div className={styles.dashboardContent}>
        <div className={styles.welcomeCard}>
          <h2 className={styles.welcomeTitle}>¡Bienvenido a tu panel de control!</h2>
          <p>Aquí puedes gestionar tu cuenta y acceder a todas las funcionalidades.</p>
          {role === "ROLE_ADMIN" && (
            <div>
              <button onClick={agregarOrg}>
                Agregar nuevo organizador
              </button>
              <h2>Organizadores</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizadores.map(org => (
                      <tr key={org.id}>
                        <td>{org.id}</td>
                        <td>{org.nombre}</td>
                        <td>
                        <button onClick={() => irAEditarOrganizador(org.id)}>
                          Editar Organizador
                        </button>
                          <button onClick={() => handleDeleteOrganizador(org.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
              
          )}          
        </div>

        {message && (
          <div className={styles.messageCard}>
            <h3 className={styles.messageTitle}>Mensaje del servidor:</h3>
            <h2 className={styles.messageContent}>{message}</h2>
          </div>
        )}

        <div className={styles.dashboardMain}>
          <aside className={styles.sidebar}>
            <h3>Menú</h3>
            <ul>
              <li>Perfil</li>
              <li>Configuración</li>
              <li>Notificaciones</li>
              <li>Ayuda</li>
            </ul>
          </aside>

          <main className={styles.mainContent}>
            <h2>Resumen</h2>
            <button onClick={agregarEv}>
                Agregar nuevo organizador
              </button>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Lugar</th>
                  <th>Organizador</th>
                  {role === "ROLE_ADMIN" && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {eventos.map(evento => (
                  <tr key={evento.id}>
                    <td>{evento.id}</td>
                    <td>{evento.nombre}</td>
                    <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                    <td>{evento.lugar}</td>
                    <td>{evento.organizador_id || 'Sin nombre'}</td>
                    {role === "ROLE_ADMIN" && (
                      <td>
                        <button onClick={() => handleDeleteEvento(evento.id)}>Eliminar</button>
                        <button onClick={() => editarEvento(evento.id)}>Editar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
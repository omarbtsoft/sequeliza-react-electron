import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Guardar info del usuario logeado

  useEffect(() => {
    if (token) {
      window.electron.verifyToken({ token }).then((response) => {
        if (response.success) {
          setUserInfo(response.user);
          setIsAuthenticated(true);
          if (response.user.role === "ADMIN") {
            window.electron.getUsers({ token }).then((userResponse) => {
              console.log(userResponse.users)
              if (userResponse.success) {
                setUsers(userResponse.users);
              }
            });
          }
        } else {
          setIsAuthenticated(false);
          setToken(null);
          localStorage.removeItem("token");
        }
      });
    }
  }, [token]);

  const handleCreateUser = () => {
    if (!firstname || !email) return;
    window.electron.createUser({ token, firstname, email }).then((response) => {
      if(response.success){
        setUsers([...users, response.user]);
      }
      setFirstname("");
      setEmail("");
    });
  };

  const handleLogin = () => {
    window.electron.login({ email: username, password }).then((response) => {
      if (response.success && response.code == 200) {        
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUserInfo(response.user);        
        setIsAuthenticated(true);   
      } else {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("token");
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    setUsers([]);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Ingresar</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Bienvenido: {userInfo?.firstname}</h1>
      <p>Email: {userInfo?.email}</p>
      <p>Rol: {userInfo?.role}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {userInfo?.role === "ADMIN" ? (
        <>
          <h1>Usuarios</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.firstname} - {user.email}
              </li>
            ))}
          </ul>

          <h2>Crear Usuario</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleCreateUser}>Crear</button>
        </>
      ) : (
        <h2>No tienes permisos para ver la lista de usuarios</h2>
      )}
    </div>
  );
}

export default App;

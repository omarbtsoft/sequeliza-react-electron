import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      window.electron.getUsers({ token }).then((response) => {
        console.log(response);
        if (response.success) {
          setUsers(response.users);
        }
      });
    }
  }, [role, role]);

  const handleCreateUser = () => {
    if (!firstname || !email) return;
    window.electron.createUser(token, firstname, email).then((newUser) => {
      setUsers([...users, newUser]);
      setFirstname("");
      setEmail("");
    });
  };

  const handleLogin = () => {
    window.electron.login({ email: username, password }).then((response) => {
      console.log(response);
      if (response.success) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setRole(response.role);
        setIsAuthenticated(true);
      } else {
        console.log("Credenciales incorrectas");
        setIsAuthenticated(false);
        setToken("");
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Usuario"
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
      <h1>Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstname} - {user.email}
          </li>
        ))}
      </ul>
      {role == "ADMIN" ? (
        <div>
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
        </div>
      ) : (
        <h2>No tienes permisos</h2>
      )}
    </div>
  );
}

export default App;

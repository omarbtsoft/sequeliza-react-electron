import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    window.electron.getUsers().then(setUsers);
  }, []);

  const handleCreateUser = () => {
    if (!firstname || !email) return;
    window.electron.createUser(firstname, email ).then((newUser) => {
      setUsers([...users, newUser]);
      setFirstname("");
      setEmail("");
    });
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.firstname} - {user.email}</li>
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
    </div>
  );
}

export default App;

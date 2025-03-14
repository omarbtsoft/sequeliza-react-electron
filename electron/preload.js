const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getUsers: (token) => ipcRenderer.invoke("list-users", token),
    createUser: (firstname, email) => ipcRenderer.invoke("create-user", firstname, email),    
    login: (data) => ipcRenderer.invoke("login", data),
    verifyToken: (token) => ipcRenderer.invoke("verifyToken", token),

});
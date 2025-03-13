const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // getData: (page, pageSize) => ipcRenderer.invoke("get-data", page, pageSize),
    getUsers: () => ipcRenderer.invoke("list-users"),
    createUser: (firstname, email) => ipcRenderer.invoke("create-user", firstname, email),
});
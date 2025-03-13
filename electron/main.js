const path = require("path");
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");

const sequelize = require("./database");
const User = require('./models/user.js');

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    autoHideMenuBar: true,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    isDev ?
    "http://localhost:3000" :
    `file://${path.join(__dirname, "../dist/index.html")}`
  );

  ipcMain.handle('list-users', async (event) => {
    try {
      const users = await User.findAll({
        raw: true
      });
      console.log("Lista de usuarios");
      console.log(users);
      return users;
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return [];
    }
  });

  ipcMain.handle('create-user', async (event, firstname, email) => {
    try {
      const user = await User.create({
        firstname: firstname,
        email: email
      });
      await user.save();
      console.log(user.dataValues);
      return user.dataValues;
    } catch (error) {
      console.error("Error en crear un usuario: ", error);
      return null;
    }
  });
}

app.whenReady().then(async () => {
  createWindow();
  await sequelize.sync({
    alter: true
  });
  console.log(" => " + process.env.OMAR);
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed",
  () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }
);
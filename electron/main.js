const path = require("path");
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
require('dotenv').config();
const sequelize = require("./database");
const {
  User,
  Role
} = require('./models/user.js');
const jwt = require("jsonwebtoken");
const isDev = process.env.IS_DEV == "true" ? true : false;
const SECRET_KEY = "clave_super_secreta";

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
  ipcMain.handle('list-users', async (event, {
    token
  }) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const email = decoded.email;
      const user = await User.findOne({
        where: {
          email
        },
        include: {
          model: Role, 
          as: "role", 
          attributes: ["name"] 
        },
        raw: true
      });

      console.log(" Rol del usuario "+user['role.name']);

      // console.log('Esto es nombre del rol : '+user.role.name);
      // Verificar si el usuario existe y si tiene el rol de ADMIN
      if (!user || user['role.name'] != "ADMIN") {
        return {
          success: false,
          message: "No autorizado"
        };
      }

      // Obtener el listado de usuarios si la verificación es exitosa
      const users = await User.findAll({
        raw: true
      });

      console.log("Lista de usuarios");
      console.log(users);

      return {
        users,
        success: true
      };
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return {        
        success: false
      };;
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

  // Iniciar sesión y generar JWT
  ipcMain.handle("login", async (event, {
    email,
    password
  }) => {
    const user = await User.findOne({
      where: {
        email
      },
      include: {
        model: Role,
        as: "role",
        attributes: ["name"]
      }
    });
    if(!user){
      return {
        success: false,        
        message: "Credenciales incorrectas"
      };
    }
    // const result = {
    //   user: user.dataValues,
    //   role: user.role ? user.role.name : null,
    // };
    
    const token = jwt.sign({
      id: user.id,
      email: user.email
    }, SECRET_KEY, {
      expiresIn: "1h"
    });

    const result = {
      success: true,
      token, 
      role:user.role ? user.role.name : null
    }
    console.log("Esto es login");
    // console.log(result)
    return {
      success: true,
      token, 
      role:user.role ? user.role.name : null
    };
  });

  // Verificar JWT
  ipcMain.handle("verifyToken", async (event, token) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return {
        success: true,
        decoded
      };
    } catch {
      return {
        success: false,
        message: "Token inválido o expirado"
      };
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
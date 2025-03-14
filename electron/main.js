const path = require("path");
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
require('dotenv').config();
const bcrypt = require("bcryptjs")
const sequelize = require("./database");
const { isAdmin, getUser } = require("./middlewares/auth.js");
const {
  User,
  Role
} = require('./models');

const jwt = require("jsonwebtoken");
const isDev = process.env.IS_DEV == "true" ? true : false;

const SECRET_KEY = process.env.JWT_SECRET_KEY || "clave_super_secreta";

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
      const auth = await isAdmin(token);
      if (!auth.success) return auth;
      const users = await User.findAll({
        raw: true
      });
      return {
        users,
        success: true,
        code: 201
      };
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return {
        success: false,
        code: 500
      };;
    }
  });

  ipcMain.handle('create-user', async (event, { firstname, email, token }) => {
    try {
      const auth = await isAdmin(token);
      if (!auth.success) return auth;
      const hashedPassword = await bcrypt.hash("123", 3);
      const user = await User.create({
        firstname: firstname,
        email: email,
        role_id: 1, 
        password: hashedPassword
      });
      await user.save();

      return {
        user: user.dataValues,
        success: true,
        code: 201
      };
    } catch (error) {
      console.error("Error en crear un usuario: ", error);
      return {
        success: false,
        code: 500
      };
    }
  });

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
    if (!user) {
      return {
        success: true,
        message: "Credenciales incorrectas",
        code: 404
      };
    }
    if(user.password){
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return { success: true, message: "Credenciales incorrectas", code: 401 };
      }
    }
    const token = jwt.sign({
      id: user.id,
      email: user.email
    }, SECRET_KEY, {
      expiresIn: "1h"
    });
    console.log(user.dataValues);
    console.log(user.role ? user.role.name : null);
    return {
      success: true,
      token,
      user: {
        ...user.dataValues,
        role: user.role ? user.role.name : null
      },
      code:200
    };
  });


  ipcMain.handle("verifyToken", async (event, { token }) => {
    try {
      const response = await getUser(token);
      if (!response.user) {
        return { success: false, message: "Usuario no encontrado", code: 404 };
      }
      return {
        success: true,
        user: { ...response.user },
        code: 201
      };
    } catch {
      return { success: false, message: "Token inválido o expirado", code: 401 };
    }
  });
}

app.whenReady().then(async () => {
  createWindow();
  // await sequelize.sync({
  //   alter: true
  // });
  await sequelize.sync();
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
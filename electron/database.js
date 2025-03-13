const {
    Sequelize
} = require('sequelize');
// const sequelize = new Sequelize({
//         dialect: 'sqlite', // Base de datos 
//         storage: './database/database.sqlite' // Que crear el archivo database.sqlite en raiz del proyecto
//     }
// )

// Si que quiere conectar a una base de datos MySQL  , se tiene que instalar: npm i mysql2 
// bd_datebase = 'prueba_electron', 'user', 'password'
const sequelize = new Sequelize('prueba_electron', 'root', '', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: false, // Opcional: desactiva logs en consola
});


module.exports = sequelize;
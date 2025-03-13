const {
    Sequelize
} = require('sequelize');

// Si que quiere conectar a una base de datos MySQL  , se tiene que instalar: npm i mysql2 
// bd_datebase = 'prueba_electron', 'user', 'password'
let sequelize = new Sequelize({
    dialect: 'sqlite', // Base de datos 
    storage: './database/database.sqlite' // Que crear el archivo database.sqlite en raiz del proyecto
});
if (process.env.DB_DIALECT != 'sqlite') {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
            logging: false, // Opcional: desactiva logs en consola
        }
    );
}

module.exports = sequelize;
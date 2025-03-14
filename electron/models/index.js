// const {Role} = require('./role.js');
// const {User} = require('./user.js');

// Role.hasMany(User, { foreignKey: 'role_id', as: 'users' , soruceKey: 'id'});
// User.belongsTo(Role, { foreignKey: 'role_id', as: 'role', sourceKey: 'id' });

// module.exports = { Role, User };
// const {
//     DataTypes
// } = require('sequelize')
// const sequelize = require('../database')

// const Role = sequelize.define('role', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
// }, {
//     tableName: 'roles',
//     timestamps: false,
//     underscored: true,
// });

// const User = sequelize.define('user', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//     },
//     firstname: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
// }, {
//     tableName: 'users',
//     timestamps: true,
//     underscored: true,
//     createdAt: true,
//     updatedAt: true,
// })

// Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
// User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// module.exports = {User, Role};


const sequelize = require('../database'); 

const User = require('./user');
const Role = require('./role');

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

module.exports = {
    sequelize,
    User,
    Role,
};
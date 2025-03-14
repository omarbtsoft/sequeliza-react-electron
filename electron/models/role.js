// const {
//     DataTypes
// } = require('sequelize')
// const sequelize = require('../database.js');

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

// exports.module = { Role };
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Role = sequelize.define('role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'roles',
    timestamps: false,
    underscored: true,
});

module.exports = Role;
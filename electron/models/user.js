const {
    DataTypes
} = require('sequelize')
const sequelize = require('../database')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: true,
    updatedAt: true,
})


module.exports = User
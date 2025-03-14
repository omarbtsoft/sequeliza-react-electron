const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "clave_super_secreta";

const getUser = async (token) => {
    try {
        if (!token) {
            return { success: false, message: "Token requerido", code: 403 };
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({
            where: { email: decoded.email },
            include: {
                model: Role,
                as: "role",
                attributes: ["name"]
            }
        });

        if (!user) {
            return { success: false, message: "Usuario no encontrado", code: 404 };
        }
        return {
            success: true,
            user: {
                ...user.dataValues,
                role: user.role ? user.role.name : "Sin rol"
            }
        };
    } catch (error) {
        return { success: false, message: "Token inválido o expirado", code: 401 };
    }
};


const isAdmin = async (token) => {
    try {
        if (!token) {
            return { success: false, message: "Token requerido", code: 403 };
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({
            where: { email: decoded.email },
            include: { model: Role, as: "role", attributes: ["name"] },
            raw: true
        });
        if (!user) {
            return { success: false, message: "Usuario no encontrado", code: 404 };
        }
        if (user['role.name'] != "ADMIN") {
            return { success: false, message: "No autorizado", code: 401 };
        }
        return { success: true, user };
    } catch (error) {
        return { success: false, message: "Token inválido o expirado", code: 401 };
    }
};
module.exports = { getUser, isAdmin };

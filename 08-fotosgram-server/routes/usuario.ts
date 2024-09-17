import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificarToken } from "../middlewares/autenticacion";

const userRoutes = Router();

// Login
userRoutes.post('/login', (req:Request, res:Response) => {
    const body = req.body;

    Usuario.findOne({email: body.email}).then((userDB => { 
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'Usuario/Contraseña no son correctos.',
            });
        }

        if (userDB.compararPassword(body.password)) {
            const tokenUser = Token.grtJwtToken({
                _id: userDB._id,
                avatar: userDB.avatar,
                nombre: userDB.nombre,
                email: userDB.email,
            });

            res.json({
                ok: true,
                token: tokenUser,
            });
        } else {
            return res.json({
                ok: false,
                message: 'Usuario/Contraseña no son correctos.',
            });
        }
    })).catch((err) => {
        throw err;
    });
})

// Crear un usuario
userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        avatar: req.body.avatar,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    }

    Usuario.create(user).then((userDB) => {
        const tokenUser = Token.grtJwtToken({
            _id: userDB._id,
            avatar: userDB.avatar,
            nombre: userDB.nombre,
            email: userDB.email,
        });

        res.json({
            ok: true,
            token: tokenUser,
        });
    }).catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});

// Actualizar Usuario
userRoutes.post('/update', verificarToken, (req: any, res: Response) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avater || req.usuario.avatar,
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}).then((userDB) => {
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID.',
            });
        }

        const tokenUser = Token.grtJwtToken({
            _id: userDB._id,
            avatar: userDB.avatar,
            nombre: userDB.nombre,
            email: userDB.email,
        })
        res.json({
            ok: true,
            token: tokenUser,
        });
    });
});

userRoutes.get('/', verificarToken, (req: any, res: Response) => {
    const usuario = req.usuario;

    res.json({
        ok: true,
        usuario,
    });
});

export default userRoutes;
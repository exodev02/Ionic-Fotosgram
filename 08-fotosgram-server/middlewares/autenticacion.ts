import { Response, Request, NextFunction } from 'express';
import Token from '../classes/token';

export const verificarToken = (req: any, res: Response, next:NextFunction) => {
    const userToken =  req.get('x-token') || '';

    Token.comprobarToken(userToken).then((decoded: any) => {
        console.log('Decoded', decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch((err) => {
        res.json({
            ok: false,
            message: 'Token no es correcto.'
        })
    })
}
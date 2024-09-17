import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
import { Response } from 'express';

export default class FileSystem {

    constructor() {}

    guardarImagenTemoporal(file: FileUpload, userId: string) {

        return new Promise<void>((resolve, reject) => {
            // Crear Carpetas
            const path = this.crearCarpetaUsuario(userId);

            // Nombre archivo
            const nombreArchivo = this.generarNombreUnico(file.name);

            // Mover del archivo del temp a nuestra carpeta
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) { 
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private generarNombreUnico(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid();

        return `${idUnico}.${extension}`
    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync(pathUser);

        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    imagenesDeTempAPost(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if (!fs.existsSync(pathTemp)) {
            return[];
        }

        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userId);

        imagenesTemp.forEach((img) => {
            fs.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`);
        });

        return imagenesTemp;
    }

    private obtenerImagenesEnTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(pathTemp) || [];
    }

    getFotoUrl(userId: string, img: string) {
        // Path de los posts
        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'posts', img);

        // Verificar si la imagen existe
        const existe = fs.existsSync(pathFoto);
        if (!existe) {
            return path.resolve(__dirname, '../assets/default-img.png');
        }

        return pathFoto;
    }
}
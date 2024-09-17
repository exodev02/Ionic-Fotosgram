import { Response, Router } from "express";
import { verificarToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from '../classes/flie-system';

const postRoutes = Router();
const fileSystem = new FileSystem(); 

// Obtener post paginados
postRoutes.get('/', async (req: any, res: Response) => {
    let page = Number(req.query.pagina) || 1;
    let skip = page - 1;
    skip *= 10;
    const posts = await Post.find().sort({_id: -1}).skip(skip).limit(10).populate('usuario', '-password').exec();
    res.json({
        ok: true,
        posts,
    })
});

// Crear post
postRoutes.post('/', verificarToken, (req: any, res: Response) => {
    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempAPost(req.usuario._id);
    body.imgs = imagenes;

    Post.create(body).then( async (postDB) => {
        await postDB.populate('usuario','-password'); //.execPopulate();

        res.json({
            ok: true,
            post: postDB,
        });
    }).catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});

//Servicio para subir imagenes
postRoutes.post('/upload', verificarToken, async (req: any, res: Response) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se subio ninguna imagen.',
        });
    }
    const file: FileUpload = req.files.image;

    if (!file) {
        return res.status(400).json({
            ok: false,
            message: 'No se subio ninguna imagen.',
        });
    }

    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            message: 'Lo que subio no es una imagen.',
        });
    }

    await fileSystem.guardarImagenTemoporal(file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype,
    });
});

postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathFoto);
});

export default postRoutes;
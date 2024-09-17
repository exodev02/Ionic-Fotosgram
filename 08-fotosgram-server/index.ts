import mongoose from "mongoose";
import Server from "./classes/server";
import userRoutes from "./routes/usuario";
import bodyParser from "body-parser";
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileUpload());

// Rustas de mi app
server.app.use("/user", userRoutes);
server.app.use("/posts", postRoutes);

// Conectar con DB
mongoose.connect('mongodb://localhost:27017/fotosgram', {
    dbName: 'fotosgram',
    autoIndex: true,
}).then(() => {
  console.log('[MongoDB] Data Base is Online')
}).catch((err) => {
  throw err;
});

//levantar express
server.start(() => {
  console.log(`[Server] running in port ${server.port}`);
});

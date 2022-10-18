const express = require("express");
const cors = require('cors');

const fileUpload = require('express-fileupload');

const { createServer } = require('http');


const { dbConnection } = require('../database/config');
const { socketController } = require("../sockets/controller");
class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth:       '/api/auth',
            buscar:       '/api/buscar',
            categorias: '/api/categorias',
            productos:   '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:   '/api/uploads',
        }



        //conectar a base de datos
        this.conectarDB();

        //Middelewares --> siempre se va a ejectutar
        this.middlewares();

        //rutas de mi aplicaicon 
        this.routes();

        //Sockets
        this.sockets();

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //cors
        this.app.use( cors() );

        //lectura y parseo del body
        this.app.use(express.json());

        //.use es para middlewares, en este caso usar directorio publico
        this.app.use(express.static('public'));

        // Fileupload - cargar achivos

        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true   // para crear la carpeta si no exite. 
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        // Servidor
        this.io.on('connection', ( socket ) =>  socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Listening at ${this.port}`)
        });
    }

}

module.exports = Server;
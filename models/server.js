const express = require("express");
const cors = require('cors')

const { dbConnection } = require('../database/config');
class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //conectar a base de datos
        this.conectarDB();

        //Middelewares --> siempre se va a ejectutar
        this.middlewares();

        //rutas de mi aplicaicon 
        this.routes();
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

    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Listening at ${this.port}`)
        });
    }

}

module.exports = Server;

const { response, request } = require('express');


const usuariosGet =  (req = request, res = response) => {

    const {q, nombre = 'no name', apikey} = req.query;

    res.json({
        msg: 'get Api - controlador',
        q,
        nombre,
        apikey
    }
        );
}

const usuariosPut =  (req, res = response) => {
    const id = req.params.id;

    res.status(400).json({
        msg: 'put',
        id
    }
        );
}

const usuariosPost =  (req, res = response) => {

    const { nombre, edad} = req.body;

    res.json({
        msg: 'post',
        nombre, 
        edad
    }
        );
}

const usuariosDelete =  (req, res = response) => {
    res.json({
        msg: 'delete',
        body
    }
        );
}




module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}
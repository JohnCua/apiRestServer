const bcryptjs = require('bcryptjs');
const { response, json } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');




const login  = async (req, res = response ) => {
    
    const { correo, password  }  = req.body;

    try {

        // verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            })
        }

        // si el usuario esta activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // generar el jwt

        const token = await generarJWT( usuario.id );

            res.json({
              usuario,
              token
            });
        
    } catch (error) {
        res.status(500).json({
            msg: 'Hablde con el administrado'
        })
    }
}


const googleSingIn = async( req, res = response ) =>{

    const { id_token } = req.body;


    try {

        const { nombre, img, correo} = await googleVerify(id_token);

        // 
        let usuario = await Usuario.findOne({correo});

        if( !usuario ) {
            //Crear usuario

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);

            await usuario.save();
        }

        //si el usuario esta bloqueado
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

         // generar el jwt

         const token = await generarJWT( usuario.id );

        
        res.json({
           usuario,
           token
        })

    } catch (error) {

        res.status(400).json({
            ok:false,
            msg: 'El token  no se pudo verificar',
            error
        })
    }

}

module.exports = {
    login,
    googleSingIn
}
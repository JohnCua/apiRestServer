const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");

const { ObjectId } = require('mongoose').Types;

const colleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productos-por-categoria',
    'roles',
];

const buscarUsuarios = async (termino = '', res = response) => {

    try {

        const esMongoId = ObjectId.isValid( termino ); //true

        if( esMongoId ) {
            const usuario = await Usuario.findById(termino);
            res.json({
                results: ( usuario ) ? [ usuario ] : []
            })
        }
    
    
        const regex = new RegExp( termino, 'i' );
    
        const usuarios = await Usuario.find({ 
            $or: [{nombre: regex }, {correo: regex}],
            $and: [{estado: true}]
        });
    
        res.json({
            results: usuarios
        });
        
    } catch (error) {
        res.status(400).json(error);
    }

   

}

const buscarCategorias = async (termino = '', res = response) => {

    try {

        const esMongoId = ObjectId.isValid( termino ); //true

        if( esMongoId ) {
            const categoria = await Categoria.findById(termino);
            res.json({
                results: ( categoria ) ? [ categoria ] : []
            })
        }
    
        const regex = new RegExp( termino, 'i' );
    
        const categorias = await Categoria.find({ nombre: regex, estado: true });
    
        res.json({
            results: categorias
        });
        
    } catch (error) {
        res.status(400).json(error);
    }

 

}

const buscarProductos = async (termino = '', res = response) => {

    try {
        const esMongoId = ObjectId.isValid( termino ); //true

        if( esMongoId ) {
            const producto = await Producto.findById(termino).populate('categoria', 'nombre');
            res.json({
                results: ( producto ) ? [ producto ] : []
            })
        }
    
    
        const regex = new RegExp( termino, 'i' );
    
        const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');
    
        res.json({
            results: productos
        });
    } catch (error) {
        res.status(400).json(error)
    }

}


const buscarProductosPorCategoria = async( termino = '', res = response) => {
 
   try {

    const esMongoId = ObjectId.isValid( termino )
 
    if ( esMongoId ) {
        const producto = await Producto.find( { categoria: ObjectId( termino ), estado:true } )
                        .select('nombre precio descripcion disponible estado')
                        .populate('categoria', 'nombre')
 
        return res.json( {
            results: ( producto ) ? [ producto ] : []
        })
    }
 
    const regex = new RegExp( termino, 'i' )
 
    const categorias = await Categoria.find({ nombre: regex, estado: true})

    if(!categorias.length) {
        return res.status(400).json({ msg: `No hay resultados para ${termino}`})
    }
    
    const productos = await Producto.find({
        $or: [...categorias.map( categoria => {return { categoria: categoria._id }})],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre');
 
 
    res.json({
        results: productos
    })
    
   } catch (error) {
    res.status(400).json(error)
   }
 
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!colleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${colleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;

        case 'productos-por-categoria':
            buscarProductosPorCategoria(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido har esta busqueda'
            });
    }

   
}

module.exports = {
    buscar
}
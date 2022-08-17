const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');
const {  existeProductoId, existeCategoriaId } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto} = require('../controllers/productos');

const router = Router();

// Obtener toda las productos - publico
router.get('/', obtenerProductos);

// Obtener una producto por id  - publico
router.get('/:id',[
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos,
], obtenerProducto)

// Crear producto - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo Valido').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
] , crearProducto)

// Actualizar una producto - privado - cuaquiera con token valido
router.put('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('id').custom(existeProductoId),
    check('categoria', 'No es un id de mongo Valido').optional().isMongoId(),
    check('categoria').optional().custom(existeCategoriaId),
    validarCampos

], actualizarProducto)

// Borrar una categoria - Admin 
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], borrarProducto)


module.exports = router;
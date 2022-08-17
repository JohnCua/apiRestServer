const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const router = Router();

// {{*}}/api/categorias

// Obtener toda las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id  - publico
router.get('/:id',[
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos,
], obtenerCategoria)

// Crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria)

// Actualizar una categoria - privado - cuaquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaId),
    validarCampos

], actualizarCategoria)

// Borrar una categoria - Admin 
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], borrarCategoria)

module.exports = router;
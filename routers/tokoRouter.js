const express = require('express')
const { auth } = require('../helpers/auth')
const { tokoController } = require('../controllers')

const router = express.Router()

router.get('/gettoko', tokoController.getToko)
router.get('/gettoko/:id', tokoController.getTokoById)
router.post('/addtoko', tokoController.addToko)
router.put('/edittoko/:id', tokoController.editToko)
router.delete('/deletetoko/:id', tokoController.deleteToko)
router.post('/addimagetoko', tokoController.addImageToko)
router.get('/imagetoko/:id', tokoController.getImageTokoByTokoId)
router.put('/imagetoko/:id', tokoController.editImageTokoById)
router.delete('/imagetoko/:id', tokoController.deleteImageTokoById)

module.exports = router
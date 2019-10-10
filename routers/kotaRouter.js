const express = require('express')
const { auth } = require('../helpers/auth')
const { kotaController } = require('../controllers')

const router = express.Router()

router.get('/getkota', kotaController.getKota)
router.get('/getkota/:id', kotaController.getKotaById)
router.post('/addkota', kotaController.addKota)
router.put('/editkota/:id', kotaController.editKota)
router.delete('/deletekota/:id', kotaController.deleteKota)

module.exports = router
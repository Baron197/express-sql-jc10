const express = require('express')
const { auth } = require('../helpers/auth')
const { userController } = require('../controllers')

const router = express.Router()

router.post('/register', userController.register)
router.post('/confirmemail', userController.confirmEmail)
router.post('/resendemailconfirm', userController.resendEmailConfirm)
router.post('/keeplogin', auth, userController.keepLogin)
router.post('/login', userController.login)

module.exports = router
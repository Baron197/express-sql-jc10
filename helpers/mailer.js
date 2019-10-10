const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'baronhartono@gmail.com',
        pass: 'jjzzmcusnrmscrzf'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = {
    transporter
};
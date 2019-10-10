const crypto = require('crypto')
const { sqlDB } = require('../database')
const { createJWTToken } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')

const secret = 'teletubies';

module.exports = {
    keepLogin: (req,res) => {
        // console.log(req.user)
        res.status(200).send({ ...req.user, token: req.token })
    },
    login: (req,res) => {
        var { email, password } = req.body;
        password = crypto.createHmac('sha256', secret)
                        .update(password)
                        .digest('hex');
    
        var sql = `SELECT id,username,email,status 
                    FROM users 
                    WHERE email = ${sqlDB.escape(email)}
                    AND password = ${sqlDB.escape(password)};`;
        
        sqlDB.query(sql, (err, results) => {
            if(err) return res.status(500).send({ err, message: 'Database Error' })
    
            if(results.length === 0) {
                return res.status(500).send({ message: 'Email or Password Incorrect' })
            }
    
            var token = createJWTToken({ ...results[0] }, { expiresIn: '1h' })
    
            res.status(200).send({ ...results[0], token })
        })
    },
    register: (req,res) => {
        req.body.status = 'Unverified'
        req.body.tanggalBergabung = new Date()
    
        req.body.password = crypto.createHmac('sha256', secret)
                        .update(req.body.password)
                        .digest('hex');
        var sql = `SELECT * FROM users WHERE email = '${req.body.email}';`;
    
        sqlDB.query(sql, (err,results) => {
            if(err) return res.status(500).send({ message:'Database Error Bro!', err, error: true })
    
            if(results.length > 0) {
                return res.status(500).send({ message: 'Email has been taken!', error: true})
            }
    
            sql = `INSERT INTO users SET ? `;
            sqlDB.query(sql, req.body, (err, results) => {
                if(err) return res.status(500).send({ message:'Database Error Bro!', err, error: true })
    
                var mailOption = {
                    from: "Toko Berkah <baronhartono@gmail.com>",
                    to: req.body.email,
                    subject: "Email Confirmation",
                    html: `Verified your email by clicking this link  
                        <a href="http://localhost:3000/emailverified?email=${req.body.email}">Verified</a>`
                }
            
                transporter.sendMail(mailOption, (err,results) => {
                    if(err) return res.status(500).send({ message: 'Kirim Email Confirmation Gagal!', err, error: false, email: req.body.email })
            
                    res.status(200).send({ status: 'Send Email Success', result: results, email: req.body.email })
                })
            })
        })
    },
    confirmEmail: (req,res) => {
        var sql = `UPDATE users SET status='Verified' WHERE email='${req.body.email}';`;
        sqlDB.query(sql, (err, results) => {
            if(err) return res.status(500).send({ status: 'error', err })
    
            sql = `SELECT id,username,email,status FROM users WHERE email = '${req.body.email}'`;
            sqlDB.query(sql, (err,results) => {
                if(err) return res.status(500).send({ err })
    
                var token = createJWTToken({ ...results[0] }, { expiresIn: '1h' })
    
                res.status(200).send({ ...results[0], token })
            })
        })
    },
    resendEmailConfirm: (req,res) => {
        var mailOption = {
            from: "Toko Berkah <baronhartono@gmail.com>",
            to: req.body.email,
            subject: "Email Confirmation",
            html: `Verified your email by clicking this link  
                <a href="http://localhost:3000/emailverified?email=${req.body.email}">Verified</a>`
        }
    
        transporter.sendMail(mailOption, (err,results) => {
            if(err) return res.status(500).send({ message: 'Kirim Email Confirmation Gagal!', err })
    
            res.status(200).send({ message: 'Send Email Success', result: results })
        })
    }
}
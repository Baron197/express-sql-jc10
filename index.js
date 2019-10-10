const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const crypto = require('crypto')
// const { kucing, jerapah } = require('./jwt')
const { transporter } = require('./helpers/mailer')
const bearerToken = require('express-bearer-token')

const app = express()
const port = process.env.PORT || 1997

app.use(bodyParser.json())
app.use(cors())
app.use(bearerToken())
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.status(200).send('<h1>Welcome To our API</h1>')
})

const { userRouter, kotaRouter, tokoRouter } = require('./routers')

app.use('/user', userRouter)
app.use('/kota', kotaRouter)
app.use('/toko', tokoRouter)

app.get('/sendmail', (req,res) => {
    var mailOption = {
        from: "Penguasa Toko Berkah <baronhartono@gmail.com>",
        to: "hartono_baron@yahoo.com",
        subject: "Undangan Bergabung",
        html: `Bergabunglah menjadi member Toko Berkah dengan
            mengclick link ini  <a href="https://google.com">Bergabung</a>`
    }

    transporter.sendMail(mailOption, (err,results) => {
        if(err) return res.status(500).send(err)

        res.status(200).send({ status: 'Send Email Success', result: results})
    })
})

// http://localhost:1997/getkota/bebas/test/halo/4124/testing
// app.get('/getkota/:idu/test/halo/:hello/:coba', (req,res) => {
//     console.log(req.params)
//     res.status(200).send('<h1>Halo Bro</h1>')
// })

// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

// app.post('/testcontoh', upload.single('image'), (req,res,next) => {
//     console.log(req.file)
//     console.log(req.body)
//     res.send('test')
// })

// http://localhost:1997/imagetoko/6 DELETE

// var nama = `' or ''='`
// var password = `' or ''='`

// var sql = `SELECT * from users where username = ${db.escape(nama)} and password = '${password}'`;

app.get('/testencrypt', (req,res) => {
    const secret = 'teletubies';
    const hash = crypto.createHmac('sha256', secret)
                    .update('abc')
                    .digest('hex');
    console.log(hash.length)
    res.status(200).send(hash)   
})

// app.get('/bikintoken', (req,res) => {
//     var hasilEncrypt = kucing({ message: 'Kita Keren', code: 10010101, cihuy: 'test' })
//     console.log('di bikin token', hasilEncrypt)
//     res.status(200).send(`<h2>${hasilEncrypt}</h2>`)
// })

// app.get('/checktoken/:token', (req,res) => {
//     jerapah(req.params.token, (kadaluarsa, hasil) => {
//         if(kadaluarsa) return res.status(500).send('Token Kadaluarsa Bro')

//         console.log('ini di checktoken',hasil)
//         res.status(200).send(hasil)
//     })
// })

app.listen(port, () => console.log(`API aktif di port ${port}`))
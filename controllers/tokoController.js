const { uploader } = require('../helpers/uploader')
const { sqlDB } = require('../database')
const fs = require('fs')

module.exports = {
    getToko: (req,res) => {
        var nama = req.query.nama || '';
        var alamat = req.query.alamat || '';
        
        var sql =`SELECT t.*, k.nama as namaKota FROM toko t
                    JOIN kota k
                    ON t.kotaId = k.id
                    WHERE t.nama LIKE '%${nama}%' 
                    AND alamat LIKE '%${alamat}%'`;
        
        if(req.query.incmin) {
            sql += ` AND totalIncome >= ${req.query.incmin}`
        }
        if(req.query.incmax) {
            sql += ` AND totalIncome <= ${req.query.incmax}`
        }
        if(req.query.datefrom) {
            sql += ` AND tanggalBerdiri >= '${req.query.datefrom}'`
        }
        if(req.query.dateto) {
            sql += ` AND tanggalBerdiri <= '${req.query.dateto}'`
        }
        if(req.query.kotaid) {
            sql += ` AND kotaId = ${req.query.kotaid}`
        }
    
        sqlDB.query(sql, (err,results) => {
            if(err) {
                // console.log(err)
                return res.status(500).send(err)
            }
            
            res.status(200).send(results)
        })
    },
    getTokoById: (req,res) => {
        var sql =`SELECT * FROM toko WHERE id=${req.params.id};`;
    
        sqlDB.query(sql, (err,results) => {
            if(err) {
                // console.log(err)
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    },
    addToko: (req,res) => {
        var newToko = req.body;
        console.log(newToko)
        if(newToko) {
            var sql = `INSERT INTO toko SET ? `
           
            sqlDB.query(sql, newToko, (err, results) => {
                if(err) {
                    return res.status(500).send(err)
                }
    
                res.status(200).send(results)
            })
        }
        else {
            res.status(500).send('Tolong kasih Body')
        }
    },
    deleteToko: (req,res) => {
        var sql = `DELETE FROM toko WHERE id = ${sqlDB.escape(req.params.id)}`
           
        sqlDB.query(sql, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    },
    editToko: (req,res) => {
        var sql = `UPDATE toko SET ? WHERE id = ${req.params.id};`;
        sqlDB.query(sql, req.body, (err,results) => {
            if(err) {
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    },
    addImageToko: (req,res) => {
        const path = '/images/toko';
        const upload = uploader(path, 'TOK').fields([{ name: 'image' }]);
    
        upload(req, res, (err) => {
            if(err){
                return res.status(500).json({ message: 'Upload file failed !', error: err.message });
            }
    
            const { image } = req.files;
            console.log(image)
    
            console.log(req.body.data)
            const data = JSON.parse(req.body.data);
            console.log(data)
            var insertData = []
            for(var i = 0; i < image.length; i++) {
                insertData.push([`${path}/${image[i].filename}`, data.tokoId])
            }
    
            var sql = `INSERT INTO imagetoko (pathName,tokoId) VALUES ? `;
            sqlDB.query(sql,[insertData], (err,results) => {
                if(err) {
                    for(var i = 0; i < image.length; i++) {
                        fs.unlinkSync('./public' + path + '/' + image[i].filename)
                    }
                    return res.status(500).send(err)
                }
    
                res.status(200).send(results)
            })
        })
    },
    getImageTokoByTokoId: (req,res) => {
        var sql = `SELECT it.*, t.nama as NamaToko from imagetoko it
                JOIN toko t
                ON t.id = it.tokoId
                WHERE tokoId = ${sqlDB.escape(req.params.id)}`;
        console.log(sql)
        sqlDB.query(sql, (err, results) => {
            if(err) return res.status(500).send(err)
    
            res.status(200).send(results)
        })
    },
    editImageTokoById: (req,res) => {
        var sql = `SELECT * FROM imagetoko WHERE id = ${sqlDB.escape(req.params.id)}`;
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)
    
            if(results.length > 0) {
                const path = '/images/toko';
                const upload = uploader(path, 'TOK').fields([{ name: 'image' }]);
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload file failed !', error: err.message });
                    }
            
                    const { image } = req.files;
                    console.log(image)
            
    
                    const data = { pathName: path + '/' + image[0].filename }
            
                    sql = `UPDATE imagetoko SET ? WHERE id = ${req.params.id};`
                    sqlDB.query(sql,data, (err,results1) => {
                        if(err) {
                            fs.unlinkSync('./public' + path + '/' + image[0].filename)
                            return res.status(500).send(err)
                        }
    
                        fs.unlinkSync('./public' + results[0].pathName)
                        res.status(200).send(results1)
                    })
                })
            }
        })
    },
    deleteImageTokoById: (req,res) => {
        var sql = `SELECT * FROM imagetoko WHERE id = ${sqlDB.escape(req.params.id)}`;
    
        sqlDB.query(sql, (err,results) => {
            if(err) return res.status(500).send(err)
    
            sql = `DELETE FROM imagetoko WHERE id = ${sqlDB.escape(req.params.id)}`;
            sqlDB.query(sql,(err, results1) => {
                if(err) return res.status(500).send(err)
    
                fs.unlinkSync('./public' + results[0].pathName)
                
                res.status(200).send(results1)
            })
        })
    }
}
const { sqlDB } = require('../database')

module.exports = {
    getKota: (req,res) => {
        var nama = req.query.nama ? req.query.nama : '';
        
        var sql =`SELECT * FROM kota WHERE nama LIKE '%${nama}%';`;
        sqlDB.query(sql, (err,results) => {
            if(err) {
                // console.log(err)
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    },
    getKotaById: (req,res) => {
        var sql =`SELECT * FROM kota WHERE id=${sqlDB.escape(req.params.id)};`;
    
        console.log(sql)
        sqlDB.query(sql, (err,results) => {
            if(err) {
                // console.log(err)
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    },
    addKota: (req,res) => {
        var kota = req.body.insertkota;
        
        if(kota) {
            var sql = `INSERT INTO kota (nama) values ? `
           
            sqlDB.query(sql, [kota], (err, results) => {
                if(err) {
                    return res.status(500).send(err)
                }
                sql = `SELECT * from kota;`
                
                sqlDB.query(sql, (err, results) => {
                    if(err) return res.status(500).send(err)
    
                    res.status(200).send(results)
                })
            })
        }
        else {
            res.status(500).send('Tolong isi query insertkota')
        }
    },
    editKota: (req,res) => {
        var data = req.body;
        var sql = `UPDATE kota SET ? WHERE id = ${req.params.id}`
           
        sqlDB.query(sql, data, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }
    
            sql = `SELECT * from kota;`
            sqlDB.query(sql, (err,results1) => {
                if(err) return res.status(500).send(err)
    
                res.status(200).send(results1)
            })
        })
    },
    deleteKota: (req,res) => {
        var sql = `DELETE FROM kota WHERE id = ${req.params.id}`
           
        sqlDB.query(sql, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    }
}
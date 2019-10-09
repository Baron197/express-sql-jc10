const jwt = require('jsonwebtoken');

module.exports = {
    createJWTToken: (payload) => {
        return jwt.sign(payload, 'tinkiwinki', { expiresIn: '1h' })
    }
}

// module.exports = {
//     kucing: (yang) => {
//         var token = jwt.sign(yang, 'tinkiwinki', { expiresIn: '25000ms' });
//         console.log('di fn kucing', token)
//         return token;
//     },
//     jerapah: (token, fn) => {
//         jwt.verify(token, 'tinkiwinki', function(err, decoded) {
//             if(err) {
//                 console.log(err)
//                 fn(true)
//             }
//             console.log('ini di jerapah', decoded)
//             fn(false, decoded)
//           });
//     }
// }

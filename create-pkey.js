const btcpay = require('btcpay'),
    fs = require('fs'),
    keypair = btcpay.crypto.generate_keypair()

fs.writeFileSync(__dirname + "/config/pkey.txt", JSON.stringify(keypair.getPrivate().toString('hex')))
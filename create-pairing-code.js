const btcpay = require('btcpay'),
    fs = require('fs'),
    pkey = fs.readFileSync("./config/pkey.txt"),
    keypair = btcpay.crypto.load_keypair(new Buffer(pkey, "hex")),
    client = new btcpay.BTCPayClient('https://www.hostname.com', keypair)

client.pair_client(process.env.PAIRING_CODE).then(code => fs.writeFileSync("./config/pairingCode.txt", JSON.stringify(code)))
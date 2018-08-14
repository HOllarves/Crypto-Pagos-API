const btcpay = require('btcpay'),
    fs = require('fs'),
    pkey = fs.readFileSync("./config/pkey.txt"),
    keypair = btcpay.crypto.load_keypair(new Buffer(pkey, "hex")),
    client = new btcpay.BTCPayClient(process.env.SERVER_URL, keypair)

client.pair_client(process.env.PAIRING_CODE)
    .then(code => { console.log(code); fs.writeFileSync(__dirname + "/config/pairingCode.txt", JSON.stringify(code)) })
    .catch(err => { console.log("Error", err) })
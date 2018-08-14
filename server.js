const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    btcpay = require('btcpay'),
    fs = require('fs'),
    PORT = process.env.PORT || 8085

require('dotenv').load()

// Starting up express
var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())

const pkey = fs.readFileSync("./config/pkey.txt")
const pairingCode = JSON.parse(fs.readFileSync("./config/pairingCode.txt"))
const keypair = btcpay.crypto.load_keypair(new Buffer(pkey, "hex"))
const client = new btcpay.BTCPayClient(process.env.SERVER_URL, keypair, pairingCode)

app.post('/', (req, res) => {

    let price = req.body.price
    let currency = req.body.currency

    if (!price || !currency) {

        res.json({
            status: 400,
            message: "Bad Request"
        })

    } else {

        let invoice = {
            "price": price,
            "currency": currency
        }

        console.log(invoice)

        client.create_invoice(invoice)
            .then(invoice => {
                if (invoice && invoice.url) {
                    res.json(invoice.url)
                } else {
                    res.json({
                        status: 500,
                        message: "Internal server error"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    error: err
                })
            })
    }
})

app.get('/rates', (req, res) => {

    let token = req.query.token
    let fiat = req.query.fiat

    if (!token || !fiat) {
        res.json({
            status: 400,
            message: "Bad request"
        })
    } else {
        let pair = token + "_" + fiat
        client.get_rates(pair)
            .then(response => {
                res.json({
                    status: 200,
                    message: "Success",
                    data: response
                })
            })
            .catch(err => {
                console.log(err)
                res.json({
                    status: 500,
                    message: "Internal server error"
                })
            })
    }
})

app.get('/', (req, res) => { res.send("There you are...") })

app.listen(PORT)
console.log("App running on PORT: ", PORT)
const {InfluxDB} = require('@influxdata/influxdb-client')

const token  = process.env.TOKEN
const org    = process.env.ORG
const bucket = process.env.BUCKET
const server = process.env.server
const port   = process.env.PORT

const client = new InfluxDB({ url: `http://${ server }:${ port}`, token: token })

module.exports = { 
    client, 
    org, 
    bucket
}
const {InfluxDB } = require('@influxdata/influxdb-client')

const data = []

// You can generate an API token from the "API Tokens Tab" in the UI
// const token = 'P3l2mmxjWjNawoxm5FVLxbao9XxwdP5DQjRvp1s-ekPf2BJIK1D_ULbrkb5nyy_mjTkIjV8N-VXdTU94vxvR0g=='
const token = 'u4cjPA21M-rtywY_ey1ddrVluX7sXkoaAa1gKzARKhpJhW4nRbrtfhhLFhrxgmO3KrtUfF9UEhFW70D-eyRPiQ=='
const org = 'adriano'
const bucket = 'calzeus'

const client = new InfluxDB({url: 'http://ae-desk-006.adriano-e.com:8086', token: token})

const queryApi = client.getQueryApi(org)

const table= []

const query = `from(bucket: "calzeus")
                    |> range(start: 2000-01-01)
                    |> filter(fn: (r) => r._measurement == "tempower_test")
                    |> group()
                    |> distinct(column: "model") 
                    |> keep(columns: ["_value"])
                    |> sort(columns: ["_value"])
                    `
queryApi.queryRows(query, {
  next(row, tableMeta) {

    const result = tableMeta.toObject(row)
    
    // console.log(JSON.stringify(o, null, 2))
    // console.log(
    //   `${result._time} ${result._measurement} in '${result.result}' (${result.table}): 2fr =${result["2fr"]} volt =${result["volt"]}`
    // ) 
    table.push( result )
    // console.log( result )
  },
  error(error) {
    console.error(error)
    console.log('Finished ERROR')
  },
  complete() {

    // const { volt } = result;
    console.log('Finished SUCCESS')
    console.log( table )
  },
})

// queryApi.queryRaw(query)
//     .then( value => { 
//           const result = value.
//           console.log( result )
//         })
//     .catch( err=> 
//           console.log(err) 
//           )




const {InfluxDB } = require('@influxdata/influxdb-client')

const data = []

// You can generate an API token from the "API Tokens Tab" in the UI
// const token = 'P3l2mmxjWjNawoxm5FVLxbao9XxwdP5DQjRvp1s-ekPf2BJIK1D_ULbrkb5nyy_mjTkIjV8N-VXdTU94vxvR0g=='
const token = 'u4cjPA21M-rtywY_ey1ddrVluX7sXkoaAa1gKzARKhpJhW4nRbrtfhhLFhrxgmO3KrtUfF9UEhFW70D-eyRPiQ=='
const org = 'adriano'
const bucket = 'calzeus'

const client = new InfluxDB({url: 'http://ae-desk-006.adriano-e.com:8086', token: token})

const queryApi = client.getQueryApi(org)

const volt = []

const query = ` from(bucket: "calzeus")
                        |> range(start: 2021-02-26T17:02:39Z, stop: 2021-02-27T15:14:18Z)     
                        |> filter(fn:(r) => r._measurement == "tempower_test")
                        |> drop(columns: ["test_status"])
                        |> filter(fn: (r) => r.station == "620" and r.model == "MSS25C4MGW06" and r.serial_number == "HRA0899563")
                        |> group(columns: ["_time"])
                        |> sort(columns: ["_time"])
                        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
                        `
                        // |> range(start: 2021-02-26T17:02:39Z, stop: 2021-02-27T15:14:18Z)
                        // x = data |> findColumn(fn: (key) => key._field == "volt", column: "_value")
                        // data |> group() |> limit(n:1, offset: 0) |> map(fn: (r) => ({ r with myRecord: x[0]}))  
queryApi.queryRows(query, {
  next(row, tableMeta) {

    const result = tableMeta.toObject(row)
    
    // console.log(JSON.stringify(o, null, 2))
    console.log(
      `${result._time} ${result._measurement} in '${result.result}' (${result.table}): 2fr =${result["2fr"]} volt =${result["volt"]}`
    )

    volt.push(result["volt"])
    // console.log( result )
  },
  error(error) {
    console.error(error)
    console.log('Finished ERROR')
  },
  complete() {

    // const { volt } = result;
    console.log('Finished SUCCESS')
    console.log( volt )
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




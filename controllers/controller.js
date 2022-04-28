const { client, org } = require('../database/config')
const { queryBuilder } = require('../helpers/query-buider')


const queryApi = client.getQueryApi(org)


const getData = async (req, res) => {

  const sn= req.params.ns
  const start= req.params.start
  const stop= req.params.stop
  // console.log( sn )
  // console.log( start )
  // console.log( stop )

  const _2fr   = [],
        _2fz   = [],
        _at    = [],
        _curr  = [],
        _volt  = [],
        _rc    = [],
        _power = [],
        _im    = [],
        _fz    = [],
        _fr    = [],
        time   = []

    const query = `from(bucket: "calzeus")
                      |> range(start: ${ start }, stop: ${ stop })
                      |> filter(fn:(r) => r._measurement == "tempower_test")
                      |> drop(columns: ["test_status"])
                      |> filter(fn: (r) => r.serial_number == "${ sn }")
                      |> group(columns: ["_time"])
                      |> sort(columns: ["_time"])
                      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
                      `
                      // |> filter(fn: (r) => r.station == "620" and r.model == "MSS25C4MGW06" and r.serial_number == "HRA0899563")
    await queryApi.queryRows(query, {
        next(row, tableMeta) {
            const result = tableMeta.toObject(row)

            _2fr.push(result["2fr"])   
            _2fz.push(result["2fz"])   
            _at.push(result.at)    
            _curr.push(result.curr)  
            _volt.push(result.volt)  
            _rc.push(result.rc)    
            _power.push(result.power) 
            _im.push(result.im)    
            _fz.push(result.fz)    
            _fr.push(result.fr)    
            time.push(result._time)  
          
        },
        error(error) {
          
          console.log('Finished ERROR')
          
          return res.status(500).json({ 
            ok: false,
            error 
          })
        },
        complete() {

          console.log('Finished SUCCESS')

          return res.status(200).json({
            time,
            _2fr,
            _2fz,
            _at,
            _curr,
            _volt,
            _rc,
            _power,
            _im,
            _fz,
            _fr,
          })
        },
      })
}

const getTests = async ( req, res ) => {
  const table= []

  const today= new Date();

  console.log(today);
  
  
  const query = `tb_first = from(bucket: "calzeus")
                          |> range(start: 2021-12-10T23:59:59Z, stop: now())
                          |> filter(fn: (r) => r._measurement == "tempower_test")
                          |> group(columns: ["serial_number", "model", "station"])
                          |> first() // use _value
                          |> duplicate(column: "_time", as: "range_start")
                          |> keep(columns: ["serial_number", "model", "station", "range_start"])
                          
                          tb_last = from(bucket: "calzeus")
                          |> range(start: 2021-12-10T23:59:59Z, stop: now())
                          |> filter(fn: (r) => r._measurement == "tempower_test")
                          |> group(columns: ["serial_number", "model", "station"])
                          |> last()
                          |> duplicate(column: "_time", as: "range_stop") 
                          |> keep(columns: ["serial_number", "model", "station", "range_stop"])
                          
                          join(tables: {key1: tb_last, key2: tb_first}, on: ["serial_number", "model", "station"], method: "inner")
                    `
  // try {

    await queryApi.queryRows(query, {
      next(row, tableMeta) {
     
          const result = tableMeta.toObject(row)
          table.push( result )
  
          },
          error(error) {
            
            console.log('Finished ERROR')
            
            return res.status(500).json({ 
              ok: false,
              error 
            })
          },
          complete() {
  
            console.log('Finished SUCCESS')
  
            return res.status(200).json({
              tests: table
            })
          },
  
      })
    
  // } catch (error) {

    // return res.status(500).json({ 
    //   ok: false,
    //   msg: 'prueba',
    //   // error 
    // })
    
  // }
  
}

const getTestsSearch = async ( req, res ) => {

  const station= req.params.station
  const model= req.params.model
  const serial= req.params.serial
  const rstart= req.params.rstart
  const rstop= req.params.rstop

  const table= []
  
  const query = queryBuilder(station, model, serial,rstart,rstop)
  // const query = `tb_first = from(bucket: "calzeus")
  //                         |> range(start: 2000-01-01)
  //                         |> filter(fn: (r) => r._measurement == "tempower_test")
  //                         |> group(columns: ["serial_number", "model", "station"])
  //                         |> first() // use _value
  //                         |> duplicate(column: "_time", as: "range_start")
  //                         |> keep(columns: ["serial_number", "model", "station", "range_start"])
                          
  //                 tb_last = from(bucket: "calzeus")
  //                         |> range(start: 2000-01-01)
  //                         |> filter(fn: (r) => r._measurement == "tempower_test")
  //                         |> group(columns: ["serial_number", "model", "station"])
  //                         |> last()
  //                         |> duplicate(column: "_time", as: "range_stop") 
  //                         |> keep(columns: ["serial_number", "model", "station", "range_stop"])
                          
  //                         join(tables: {key1: tb_last, key2: tb_first}, on: ["serial_number", "model", "station"], method: "inner")
  //                         |> filter(fn: (r) => r.station == "600")
  //                   `
  // console.log(query)

  await queryApi.queryRows(query, {
    next(row, tableMeta) {
   
        const result = tableMeta.toObject(row)
        table.push( result )

        },
        error(error) {
          
          console.log('Finished ERROR')
          
          return res.status(500).json({ 
            ok: false,
            error 
          })
        },
        complete() {

          console.log('Finished SUCCESS')

          return res.status(200).json({
            tests: table
          })
        },

    })
}

const getStations = async ( req, res ) => {
  const stations= []
  
  const query = `from(bucket: "calzeus")
                    |> range(start: 2020-01-01)
                    |> filter(fn: (r) => r._measurement == "tempower_test" and r._field == "fr")
                    |> first() |> group()
                    |> distinct(column: "station")
                    |> sort(columns: ["_value"])
                    `
  
  await queryApi.queryRows(query, {
    next(row, tableMeta) {
   
        const result = tableMeta.toObject(row)
        stations.push( result._value )

        },
        error(error) {
          
          console.log('Finished ERROR')
          
          return res.status(500).json({ 
            ok: false,
            error 
          })
        },
        complete() {

          console.log('Finished SUCCESS')

          return res.status(200).json({
            stations
          })
        },

    })
}


const getModels = async ( req, res ) => {
  const models= []
  
  const query = `from(bucket: "calzeus")
                    |> range(start: 2020-01-01)
                    |> filter(fn: (r) => r._measurement == "tempower_test" and r._field == "fr")
                    |> first() |> group()
                    |> distinct(column: "model")
                    |> sort(columns: ["_value"])
                    `
  
  await queryApi.queryRows(query, {
    next(row, tableMeta) {
   
        const result = tableMeta.toObject(row)
        models.push( result._value )

        },
        error(error) {
          
          console.log('Finished ERROR')
          
          return res.status(500).json({ 
            ok: false,
            error 
          })
        },
        complete() {

          console.log('Finished SUCCESS')

          return res.status(200).json({
            models
          })
        },

    })
}

module.exports = {
                  getData,
                  getTests,
                  getTestsSearch,
                  getStations,
                  getModels
                }
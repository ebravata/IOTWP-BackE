const { client, org } = require('../database/config')
const { queryBuilder } = require('../helpers/query-buider')


const queryApi = client.getQueryApi(org)


const getData = async (req, res) => {

  const ns      =  req.params.ns
  const station =  req.params.station
  const model   =  req.params.model
  const id      =  req.params.id
  const rstart  =  req.params.rstart
  const rstop   =  req.params.rstop

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

const query = `from (bucket: "calzeus")
                  |> range(start: ${ rstart }, stop: ${ rstop })
                  |> filter(fn:(r) => r._measurement == "tempower_test")
                  |> filter(fn: (r) => r.station == "${ station  }" and r.model == "${ model }" and r.serial_number == "${ ns }" and r.uid == "${ id }")
                  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
              `

              console.log( query )
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
  const rstart= req.params.rstart
  const rstop= req.params.rstop

  const query = `
                import "strings"

                uid_to_time = (uid) => {
                    ll_dtime = strings.split(v: uid, t: "-")
                
                    yyt = strings.substring(v: ll_dtime[0], start: 0, end: 4)
                    mnt = strings.substring(v: ll_dtime[0], start: 4, end: 6)
                    ddt = strings.substring(v: ll_dtime[0], start: 6, end: 8)
                
                    hht = strings.substring(v: ll_dtime[1], start: 0, end: 2)
                    mmt = strings.substring(v: ll_dtime[1], start: 2, end: 4)
                    sst = strings.substring(v: ll_dtime[1], start: 4, end: 6)
                
                    ddate = strings.joinStr(arr: [yyt, mnt, ddt], v: "-")
                    ttime = strings.joinStr(arr: [hht, mmt, sst], v: ":")
                    date_time = ddate +"T"+ ttime +"Z"

                    return time(v: date_time )
                }
  
  from(bucket: "calzeus")
                    |> range(start: ${ rstart }, stop: ${ rstop })
                    |> filter(fn: (r) => r._measurement == "tempower_test" and r._field == "fr")
                    |> first(column: "_time")
                    |> map(fn: (r) => ({ r with range_start: uid_to_time(uid: r.uid) }))
                    |> filter(fn: (r) => ( r.range_start >= ${ rstart }T23:59:59Z ))
                    |> keep(columns: ["range_start", "uid", "serial_number", "model", "station"])
                    |> group() |> sort(columns: ["range_start"])
                    `
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

const getTestsSearch = async ( req, res ) => {

  const station= req.params.station
  const model= req.params.model
  const serial= req.params.serial
  const rstart= req.params.rstart
  const rstop= req.params.rstop

  const table= []
  
  const query = queryBuilder(station, model, serial,rstart,rstop)

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
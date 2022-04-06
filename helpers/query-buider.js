

const queryBuilder= (station, model, serial, range_start, range_stop)=>{
    console.log(station)
    console.log(model)
    console.log(serial) 
    
    
    if (range_start==='no-date'){

        range =`(start: 2000-01-01)`
    }else{
        range_start += 'T23:59:59Z'
        range_stop += 'T23:59:59Z'
        range= `(start: ${ range_start }, stop: ${ range_stop })`
        }

    let query1 = `
        tb_first = from(bucket: "calzeus")
            |> range${ range }
            |> filter(fn: (r) => r._measurement == "tempower_test")
            |> group(columns: ["serial_number", "model", "station"])
            |> first() // use _value
            |> duplicate(column: "_time", as: "range_start")
            |> keep(columns: ["serial_number", "model", "station", "range_start"])
            

        tb_last = from(bucket: "calzeus")
            |> range${ range }
            |> filter(fn: (r) => r._measurement == "tempower_test")
            |> group(columns: ["serial_number", "model", "station"])
            |> last()
            |> duplicate(column: "_time", as: "range_stop") 
            |> keep(columns: ["serial_number", "model", "station", "range_stop"])

            join(tables: {key1: tb_last, key2: tb_first}, on: ["serial_number", "model", "station"], method: "inner")
        `
    if (station!='Station')        
        query1 += `|> filter(fn: (r) => r.station == "${ station }")`
        
    if (model!='Model')
        query1 += `|> filter(fn: (r) => r.model == "${ model }")`
        
    if (serial!='no-serial')
        query1 += `|> filter(fn: (r) => r.serial_number == "${ serial }")`


        // query1 += `|> sort(columns: ["_range_start"])`
    
    

        // console.log(query1)

    return query1
}

module.exports= {
                queryBuilder
            }
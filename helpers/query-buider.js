

const queryBuilder= (station, model, serial, range_start, range_stop)=>{
    console.log(station)
    console.log(model)
    console.log(serial) 
    
    
    if (range_start==='no-date'){

        range =`(start: 2000-01-01)`
        rstart = '2000-01-01';
    }else{
        rstart = range_start;
        range_start += 'T23:59:59Z'
        range_stop += 'T23:59:59Z'
        range= `(start: ${ range_start }, stop: ${ range_stop })`
        }

        

    let query1 = `
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
                    |> range${ range }
                    |> filter(fn: (r) => r._measurement == "tempower_test" and r._field == "fr")
                    |> first(column: "_time")
                    |> map(fn: (r) => ({ r with range_start: uid_to_time(uid: r.uid) }))
                    |> filter(fn: (r) => ( r.range_start >= ${ rstart }T23:59:59Z ))
                    |> keep(columns: ["range_start", "uid", "serial_number", "model", "station"])
                    |> group() |> sort(columns: ["range_start"])
                    `

    if (station!='Station')        
        query1 += `|> filter(fn: (r) => r.station == "${ station }")`
        
    if (model!='Model')
        query1 += `|> filter(fn: (r) => r.model == "${ model }")`
        
    if (serial!='no-serial')
        query1 += `|> filter(fn: (r) => r.serial_number == "${ serial }")`


        // query1 += `|> sort(columns: ["_range_start"])`
    
    

        console.log(query1)

    return query1
}

module.exports= {
                queryBuilder
            }
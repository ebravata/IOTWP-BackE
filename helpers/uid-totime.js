
    uid_to_time = (uid) => {
        // ll_dtime = strings.split(v: uid, t: "-")
        ll_dtime = uid.split('-');
    
        // yyt = strings.substring(v: ll_dtime[0], start: 0, end: 4)
        yyt = ll_dtime[0].slice(0,4)
        mnt = ll_dtime[0].slice(4,6)
        ddt = ll_dtime[0].slice(6,8)
    
        hht = ll_dtime[1].slice(0,2)
        mmt = ll_dtime[1].slice(2,4)
        sst = ll_dtime[1].slice(4,6)
    
        ddate = `${yyt}-${mnt}-${ddt}`
        ttime = `${hht}-${mmt}-${sst}`
        // ddate = ddateTime.concat(yyt + mnt ddt)
        // ttime = strings.joinStr(arr: [hht, mmt, sst], v: ":")
        date_time = `${ddate}T${ttime}Z`
        console.log(date_time)
        return date_time
    }

    module.exports = { uid_to_time }
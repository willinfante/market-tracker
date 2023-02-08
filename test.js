console.log(jsonf.map(item => {

    let x = item.month.split("-");
    month = parseInt(x[1]);
    if (month < 65) {
        month += 1900;
    } else {
        month += 1800;
    }
    item.month = x[0] + "-" + month;

    return item.month + "," + item.SPSE
    
}).join('\n'));


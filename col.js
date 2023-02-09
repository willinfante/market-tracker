const x = require('./wages.json')

var colnames = [
    "Year",
    "basicindgoods", ,
    "avgannualwage",
    "pricestatecoopstores,",
    "pricecollectivefarmmarket"
];

z = x.map(item=>{
    let output = {};
    for(let i = 0; i < colnames.length; i++){
        output[colnames[i]] = item[i];
    }
    return output;
});

console.log(JSON.stringify(z));

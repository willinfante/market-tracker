var http = require('http');
var https = require('https');
var fs = require('fs');
const path = require('path');
var express = require('express');

//Variables
var hostname = '127.0.0.1';
var port = 3000;
var command = "https:\/\/query1.finance.yahoo.com/v7/finance/quote?fields=symbol,longName,shortName,regularMarketPrice,regularMarketTime,regularMarketChange,regularMarketDayHigh,regularMarketDayLow,regularMarketPrice,regularMarketOpen,regularMarketVolume,averageDailyVolume3Month,marketCap,bid,ask,dividendYield,dividendsPerShare,exDividendDate,trailingPE,priceToSales,tarketPricecMean&formatted=false&symbols="

//Retrieve data from yahoo finance
function getData(num, symb, callback) {

  //Make Request to query1.finance.yahoo.com
  https.get(command + symb, (resp) => {

    let dat = '';  //Variable to store Data

    // When a chunk is recieved ...
    resp.on('data', (chunk) => {
      dat += chunk;  //Add the chunk to the 'dat' variable to store
    });

    //When The Host Stops Sending Chunks ....
    resp.on('end', () => {

      //Seperate 'dat' into variables
      var symbol = JSON.parse(dat).quoteResponse.result[num].symbol;
      var short = JSON.parse(dat).quoteResponse.result[num].longName;
      var price = JSON.parse(dat).quoteResponse.result[num].regularMarketPrice;
      var open = JSON.parse(dat).quoteResponse.result[num].regularMarketOpen;
      var high = JSON.parse(dat).quoteResponse.result[num].regularMarketDayHigh;
      var low = JSON.parse(dat).quoteResponse.result[num].regularMarketDayLow;
      var prevClose = JSON.parse(dat).quoteResponse.result[num].regularMarketPreviousClose;
      var pe = JSON.parse(dat).quoteResponse.result[num].trailingPE;
      var mktcp = JSON.parse(dat).quoteResponse.result[num].marketCap;
      var regmktch = JSON.parse(dat).quoteResponse.result[num].regularMarketChange;
      var mktvol = JSON.parse(dat).quoteResponse.result[num].regularMarketVolume;
      var state = JSON.parse(dat).quoteResponse.result[num].regularMarketState;
      var bid = JSON.parse(dat).quoteResponse.result[num].bid;
      var ask = JSON.parse(dat).quoteResponse.result[num].ask;
      var divps = JSON.parse(dat).quoteResponse.result[num].dividendsPerShare;
      var rev = JSON.parse(dat).quoteResponse.result[num].revenue;
      var sO = JSON.parse(dat).quoteResponse.result[num].sharesOutstanding;
      var tradable = JSON.parse(dat).quoteResponse.result[num].tradable;
      var ftwhcp = JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekHighChangePercent;
      var ftwl = JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekLow;
      var ftwh = JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekHigh;
      var ftwhc = JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekHighChange;
      var ftwlc = JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekLowChange;
      var ftwlcp = JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekLowChangePercent;

      //Return the data to the callback function
      var result = callback(symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp);
    });
  });
}


app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/main.html'));
});

app.get('/russia', (req, res) => {
  res.sendFile(path.join(__dirname, '/russiamain.html'));
});

app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, '/chart.html'));
});

app.use('/public', express.static('public'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/rus-stock-index-data-320588309485', (req, res) =>{
  getData(0, 'RSXJ', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
    let currentPrice = price;
    let previousPrice = prevClose;
    let chg = currentPrice - previousPrice;
    let pct = ((price - prevClose) / prevClose) * 100;
    let dir = '';
    console.log(chg);
    console.log(currentPrice);
    console.log(previousPrice);
    if (Math.sign(chg) > 0) {
      dir = '+';
    } else {
      dir = '';
    }
    res.send('RUSSIA STOCK INDEX ' + dir + Math.round(10*chg)/10 + ' (' + Math.round(10*pct)/10 + '%' + ')');

  });
});
//64756853857=1921

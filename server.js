var http = require('http');
var https = require('https');
var fs = require('fs');
const path = require('path');
var express = require('express');
const bodyParser = require('body-parser');

//Variables
var hostname = '127.0.0.1';
var port = 3000;
var command = "https:\/\/query1.finance.yahoo.com/v6/finance/quote?fields=symbol,longName,shortName,regularMarketPrice,regularMarketTime,regularMarketChange,regularMarketDayHigh,regularMarketDayLow,regularMarketPrice,regularMarketOpen,regularMarketVolume,averageDailyVolume3Month,marketCap,bid,ask,dividendYield,dividendsPerShare,exDividendDate,trailingPE,priceToSales,tarketPricecMean&formatted=false&symbols="

//
//Retrieve data from yahoo finance
function getData(num, symb, callback) {
  console.log(num);
  console.log(symb);

  //Make Request to query1.finance.yahoo.com
  https.get(command + symb, (resp) => {

    let dat = '';  //Variable to store Data

    // When a chunk is recieved ...
    resp.on('data', (chunk) => {
      dat += chunk;  //Add the chunk to the 'dat' variable to store
    });

    //When The Host Stops Sending Chunks ....
    resp.on('end', () => {
      console.log(dat);

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

function returnData(symbol, callback) {
  let currentPrice;
  let ch;
  let changeofprice;
  let percentchange;
  let dataArray = [];

  getData(0, symbol, function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
    currentPrice = price;
    ch = '';
    changeofprice = String(currentPrice - prevClose);
    percentchange = String(((price - prevClose) / prevClose) * 100);
    if (Math.sign(changeofprice) > 0) {
      ch = '+';
    } else {
      ch = '';
    }
    dataArray[0] = changeofprice;
    dataArray[1] = percentchange;
    dataArray[2] = currentPrice;
    dataArray[3] = ch;

    var result = callback(dataArray[0], dataArray[1], dataArray[2], dataArray[3]);
  });
}

app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/addholding', (req, res) => {
  // console.log(`Register new holding:${req.body.ticker}, ${req.body.shares}, ${req.body.price}.`);
  console.log(req.body.ticker);
  console.log(req.body.shares);
  console.log(req.body.prices);
  fs.writeFile()
});

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
app.get('/unitedstates', (req, res) => {
  res.sendFile(path.join(__dirname, '/usmain.html'));
});


app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, '/chart.html'));
});

app.use('/public', express.static('public'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


app.get('/commodities', (req, res) => {
  var dir = [];
  var chag = [];
  var perc = [];
  var prices = [];

  returnData('SI=F', function (chng, pctt, crt, sym) {

    chag[0] = chng;
    perc[0] = pctt;
    prices[0] = crt;
    dir[0] = sym;

    returnData('GC=F', function (chng, pctt, crt, sym) {

      chag[1] = chng;
      perc[1] = pctt;
      prices[1] = crt;
      dir[1] = sym;

      returnData('CL=F', function (chng, pctt, crt, sym) {

        chag[2] = chng;
        perc[2] = pctt;
        prices[2] = crt;
        dir[2] = sym;

        returnData('ZW=F', function (chng, pctt, crt, sym) {

          chag[3] = chng;
          perc[3] = pctt;
          prices[3] = crt;
          dir[3] = sym;

          returnData('KC=F', function (chng, pctt, crt, sym) {

            chag[4] = chng;
            perc[4] = pctt;
            prices[4] = crt;
            dir[4] = sym;

            returnData('HO=F', function (chng, pctt, crt, sym) {

              chag[5] = chng;
              perc[5] = pctt;
              prices[5] = crt;
              dir[5] = sym;

              returnData('RB=F', function (chng, pctt, crt, sym) {

                chag[6] = chng;
                perc[6] = pctt;
                prices[6] = crt;
                dir[6] = sym;
                let gasoline = prices[6] + " " + dir[6] + Math.round(10 * chag[6]) / 10 + ' (' + Math.round(10 * perc[6]) / 10 + '%' + ')';
                let heatingoil = prices[5] + " " + dir[5] + Math.round(10 * chag[5]) / 10 + ' (' + Math.round(10 * perc[5]) / 10 + '%' + ')';
                let coffee = prices[4] + " " + dir[4] + Math.round(10 * chag[4]) / 10 + ' (' + Math.round(10 * perc[4]) / 10 + '%' + ')';
                let wheat = prices[3] + " " + dir[3] + Math.round(10 * chag[3]) / 10 + ' (' + Math.round(10 * perc[3]) / 10 + '%' + ')';
                let crude = prices[2] + " " + dir[2] + Math.round(10 * chag[2]) / 10 + ' (' + Math.round(10 * perc[2]) / 10 + '%' + ')';
                let gold = prices[1] + " " + dir[1] + Math.round(10 * chag[1]) / 10 + ' (' + Math.round(10 * perc[1]) / 10 + '%' + ')';
                let silver = prices[0] + " " + dir[0] + Math.round(10 * chag[0]) / 10 + ' (' + Math.round(10 * perc[0]) / 10 + '%' + ')';
                var result = [];

                result.push({ "crude": crude });
                result.push({ "Silver": silver });
                result.push({ "Gold": gold });
                result.push({ "Wheat": wheat });
                result.push({ "coffee": coffee });
                result.push({ "heat": heatingoil });
                result.push({ "gas": gasoline });

                res.contentType('application/json');
                res.send(JSON.stringify(result));
              });
            });
          });
        });
      });
    });
  });
});

app.get('/forex', (req, res) => {
  var dir = [];
  var chag = [];
  var perc = [];
  var prices = [];
  var packet = [];

  returnData('EURUSD=X', function (chng, pctt, crt, sym) {

    chag[0] = chng;
    perc[0] = pctt;
    prices[0] = crt;
    dir[0] = sym;

    returnData('JPY=X', function (chng, pctt, crt, sym) {

      chag[1] = chng;
      perc[1] = pctt;
      prices[1] = crt;
      dir[1] = sym;

      returnData('RUB=X', function (chng, pctt, crt, sym) {

        chag[2] = chng;
        perc[2] = pctt;
        prices[2] = crt;
        dir[2] = sym;
        returnData('CNY=X', function (chng, pctt, crt, sym) {

          chag[3] = chng;
          perc[3] = pctt;
          prices[3] = crt;
          dir[3] = sym;
          returnData('CAD=X', function (chng, pctt, crt, sym) {

            chag[4] = chng;
            perc[4] = pctt;
            prices[4] = crt;
            dir[4] = sym;


            let euro = prices[0] + " " + dir[0] + Math.round(10 * chag[0]) / 10 + ' (' + Math.round(10 * perc[0]) / 10 + '%' + ')';
            let japan = prices[1] + " " + dir[1] + Math.round(10 * chag[1]) / 10 + ' (' + Math.round(10 * perc[1]) / 10 + '%' + ')';
            let russia = prices[2] + " " + dir[2] + Math.round(10 * chag[2]) / 10 + ' (' + Math.round(10 * perc[2]) / 10 + '%' + ')';
            let china = prices[3] + " " + dir[3] + Math.round(10 * chag[3]) / 10 + ' (' + Math.round(10 * perc[3]) / 10 + '%' + ')';
            let canada = prices[4] + " " + dir[4] + Math.round(10 * chag[4]) / 10 + ' (' + Math.round(10 * perc[4]) / 10 + '%' + ')';

            var result = [];

            result.push({ "EUR/USD": euro });
            result.push({ "JPY/USD": japan });
            result.push({ "RUB/USD": russia });
            result.push({ "CNY/USD": china });
            result.push({ "CAD/USD": canada });

            res.contentType('application/json');
            res.send(JSON.stringify(result));
          });
        });
      });
    });
  });
});

app.get('/watchlist', (req, res) => {
  var dir = [];
  var chag = [];
  var perc = [];
  var prices = [];
  var packet = [];

  returnData('^VIX', function (chng, pctt, crt, sym) {

    chag[0] = chng;
    perc[0] = pctt;
    prices[0] = crt;
    dir[0] = sym;

    returnData('^SKEW', function (chng, pctt, crt, sym) {

      chag[1] = chng;
      perc[1] = pctt;
      prices[1] = crt;
      dir[1] = sym;

      returnData('^TNX', function (chng, pctt, crt, sym) {

        chag[2] = chng;
        perc[2] = pctt;
        prices[2] = crt;
        dir[2] = sym;


        let a = prices[0] + " " + dir[0] + Math.round(10 * chag[0]) / 10 + ' (' + Math.round(10 * perc[0]) / 10 + '%' + ')';
        let b = prices[1] + " " + dir[1] + Math.round(10 * chag[1]) / 10 + ' (' + Math.round(10 * perc[1]) / 10 + '%' + ')';
        let c = prices[2] + " " + dir[2] + Math.round(10 * chag[2]) / 10 + ' (' + Math.round(10 * perc[2]) / 10 + '%' + ')';

        var result = [];

        result.push({ "vix": a });
        result.push({ "libor": c });
        result.push({ "skew": b });

        res.contentType('application/json');
        res.send(JSON.stringify(result));

      });
    });
  });
});
app.get('/sectors', (req, res) => {
  var dir = [];
  var chag = [];
  var perc = [];
  var prices = [];
  var packet = [];
  returnData('GSPE', function (chng, pctt, crt, sym) {

    chag[0] = chng;
    perc[0] = pctt;
    prices[0] = crt;
    dir[0] = sym;

    returnData('^SP500-40', function (chng, pctt, crt, sym) {

      chag[1] = chng;
      perc[1] = pctt;
      prices[1] = crt;
      dir[1] = sym;
      returnData('^SP500-20', function (chng, pctt, crt, sym) {

        chag[2] = chng;
        perc[2] = pctt;
        prices[2] = crt;
        dir[2] = sym;

        returnData('^SP500-60', function (chng, pctt, crt, sym) {

          chag[3] = chng;
          perc[3] = pctt;
          prices[3] = crt;
          dir[3] = sym;

          returnData('^SP500-45', function (chng, pctt, crt, sym) {

            chag[4] = chng;
            perc[4] = pctt;
            prices[4] = crt;
            dir[4] = sym;

            returnData('^SP500-15', function (chng, pctt, crt, sym) {

              chag[5] = chng;
              perc[5] = pctt;
              prices[5] = crt;
              dir[5] = sym;

              returnData('^SP500-30', function (chng, pctt, crt, sym) {

                chag[6] = chng;
                perc[6] = pctt;
                prices[6] = crt;
                dir[6] = sym;

                returnData('^SP500-35', function (chng, pctt, crt, sym) {

                  chag[7] = chng;
                  perc[7] = pctt;
                  prices[7] = crt;
                  dir[7] = sym;

                  returnData('^SP500-25', function (chng, pctt, crt, sym) {

                    chag[8] = chng;
                    perc[8] = pctt;
                    prices[8] = crt;
                    dir[8] = sym;

                    returnData('^SP500-55', function (chng, pctt, crt, sym) {

                      chag[9] = chng;
                      perc[9] = pctt;
                      prices[9] = crt;
                      dir[9] = sym;

                      returnData('^SP500-50', function (chng, pctt, crt, sym) {

                        chag[10] = chng;
                        perc[10] = pctt;
                        prices[10] = crt;
                        dir[10] = sym;

                        let communications = prices[10] + " " + dir[10] + Math.round(10 * chag[10]) / 10 + ' (' + Math.round(10 * perc[10]) / 10 + '%' + ')';
                        let utilites = prices[9] + " " + dir[9] + Math.round(10 * chag[9]) / 10 + ' (' + Math.round(10 * perc[9]) / 10 + '%' + ')';
                        let consumerdiscretionary = prices[8] + " " + dir[8] + Math.round(10 * chag[8]) / 10 + ' (' + Math.round(10 * perc[8]) / 10 + '%' + ')';
                        let healthcare = prices[7] + " " + dir[7] + Math.round(10 * chag[7]) / 10 + ' (' + Math.round(10 * perc[7]) / 10 + '%' + ')';
                        let consumerstaples = prices[6] + " " + dir[6] + Math.round(10 * chag[6]) / 10 + ' (' + Math.round(10 * perc[6]) / 10 + '%' + ')';
                        let materials = prices[5] + " " + dir[5] + Math.round(10 * chag[5]) / 10 + ' (' + Math.round(10 * perc[5]) / 10 + '%' + ')';
                        let technology = prices[4] + " " + dir[4] + Math.round(10 * chag[4]) / 10 + ' (' + Math.round(10 * perc[4]) / 10 + '%' + ')';
                        let realestate = prices[3] + " " + dir[3] + Math.round(10 * chag[3]) / 10 + ' (' + Math.round(10 * perc[3]) / 10 + '%' + ')';
                        let industrials = prices[2] + " " + dir[2] + Math.round(10 * chag[2]) / 10 + ' (' + Math.round(10 * perc[2]) / 10 + '%' + ')';
                        let financials = prices[1] + " " + dir[1] + Math.round(10 * chag[1]) / 10 + ' (' + Math.round(10 * perc[1]) / 10 + '%' + ')';
                        let energy = prices[0] + " " + dir[0] + Math.round(10 * chag[0]) / 10 + ' (' + Math.round(10 * perc[0]) / 10 + '%' + ')';
                        var result = [];

                        result.push({ "staples": consumerstaples });
                        result.push({ "mat": materials });
                        result.push({ "tech": technology });
                        result.push({ "re": realestate });
                        result.push({ "ind": industrials });
                        result.push({ "fin": financials });
                        result.push({ "ene": energy });
                        result.push({ "com": communications });
                        result.push({ "ut": utilites });
                        result.push({ "cond": consumerdiscretionary });
                        result.push({ "health": healthcare });

                        res.contentType('application/json');
                        res.send(JSON.stringify(result));
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

app.get('/rus-stock-index-data-320588309485', (req, res) => {
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
    res.send('Russian Federation ' + dir + Math.round(10 * chg) / 10 + ' (' + Math.round(10 * pct) / 10 + '%' + ')');

  });
});

app.get('/us-stock-index-data-320588309485', (req, res) => {
  getData(0, 'SPY', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
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
    res.send('United States ' + dir + Math.round(10 * chg) / 10 + ' (' + Math.round(10 * pct) / 10 + '%' + ')');

  });
});
/*
//64756853857=1921
returnData('SPY', function (a, b, c, d) {
  console.log(a + b + c + d);
});
*/
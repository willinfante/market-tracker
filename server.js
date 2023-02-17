var http = require('http');
var https = require('https');
var fs = require('fs');
const path = require('path');
var express = require('express');

//Variables
var hostname = '127.0.0.1';
var port = 3000;
var command = "https:\/\/query1.finance.yahoo.com/v7/finance/quote?fields=symbol,longName,shortName,regularMarketPrice,regularMarketTime,regularMarketChange,regularMarketDayHigh,regularMarketDayLow,regularMarketPrice,regularMarketOpen,regularMarketVolume,averageDailyVolume3Month,marketCap,bid,ask,dividendYield,dividendsPerShare,exDividendDate,trailingPE,priceToSales,tarketPricecMean&formatted=false&symbols="

//
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


app.get('/commodities', (req, res) => {
  var dir = [];
  var chag = [];
  var perc = [];
  var prices = [];
  var packet = [];
  getData(0, 'SI=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
    let currentPrice = price;
    let previousPrice = prevClose;
    let chg = currentPrice - previousPrice;
    let pct = ((price - prevClose) / prevClose) * 100;
    console.log('CHANGE: ' + chg);
    console.log('PERCENT: ' + pct);

    chag[0] = String(chg);
    perc[0] = String(pct);
    prices[0] = currentPrice;

    if (Math.sign(chag[0]) > 0) {
      dir[0] = '+';
    } else {
      dir[0] = '';
    }
    getData(0, 'GC=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
      let currentPrice = price;
      let previousPrice = prevClose;
      chag[1] = String(currentPrice - previousPrice);
      perc[1] = String(((price - prevClose) / prevClose) * 100);
      prices[1] = currentPrice;
      if (Math.sign(chag[1]) > 0) {
        dir[1] = '+';
      } else {
        dir[1] = '';
      }
      console.log(chag[0]);
      getData(0, 'CL=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
        let currentPrice = price;
        let previousPrice = prevClose;
        chag[2] = String(currentPrice - previousPrice);
        perc[2] = String(((price - prevClose) / prevClose) * 100);
        prices[2] = currentPrice;
        if (Math.sign(chag[2]) > 0) {
          dir[2] = '+';
        } else {
          dir[2] = '';
        }
        getData(0, 'ZW=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
          let currentPrice = price;
          let previousPrice = prevClose;
          chag[3] = String(currentPrice - previousPrice);
          perc[3] = String(((price - prevClose) / prevClose) * 100);
          prices[3] = currentPrice;
          if (Math.sign(chag[3]) > 0) {
            dir[3] = '+';
          } else {
            dir[3] = '';
          }
          getData(0, 'KC=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
            let currentPrice = price;
            let previousPrice = prevClose;
            chag[4] = String(currentPrice - previousPrice);
            perc[4] = String(((price - prevClose) / prevClose) * 100);
            prices[4] = currentPrice;
            if (Math.sign(chag[4]) > 0) {
              dir[4] = '+';
            } else {
              dir[4] = '';
            }
            getData(0, 'HO=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
              let currentPrice = price;
              let previousPrice = prevClose;
              chag[5] = String(currentPrice - previousPrice);
              perc[5] = String(((price - prevClose) / prevClose) * 100);
              prices[5] = currentPrice;
              if (Math.sign(chag[5]) > 0) {
                dir[5] = '+';
              } else {
                dir[5] = '';
              }
              getData(0, 'RB=F', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
                let currentPrice = price;
                let previousPrice = prevClose;
                chag[6] = String(currentPrice - previousPrice);
                perc[6] = String(((price - prevClose) / prevClose) * 100);
                prices[6] = currentPrice;
                if (Math.sign(chag[6]) > 0) {
                  dir[6] = '+';
                } else {
                  dir[6] = '';
                }
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
  getData(0, 'EURUSD=X', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
    let currentPrice = price;
    let previousPrice = prevClose;
    let chg = currentPrice - previousPrice;
    let pct = ((price - prevClose) / prevClose) * 100;
    console.log('CHANGE: ' + chg);
    console.log('PERCENT: ' + pct);

    chag[0] = String(chg);
    perc[0] = String(pct);
    prices[0] = currentPrice;

    if (Math.sign(chag[0]) > 0) {
      dir[0] = '+';
    } else {
      dir[0] = '';
    }
    getData(0, 'JPY=X', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
      let currentPrice = price;
      let previousPrice = prevClose;
      chag[1] = String(currentPrice - previousPrice);
      perc[1] = String(((price - prevClose) / prevClose) * 100);
      prices[1] = currentPrice;
      if (Math.sign(chag[1]) > 0) {
        dir[1] = '+';
      } else {
        dir[1] = '';
      }
      console.log(chag[0]);
      getData(0, 'RUB=X', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
        let currentPrice = price;
        let previousPrice = prevClose;
        chag[2] = String(currentPrice - previousPrice);
        perc[2] = String(((price - prevClose) / prevClose) * 100);
        prices[2] = currentPrice;
        if (Math.sign(chag[2]) > 0) {
          dir[2] = '+';
        } else {
          dir[2] = '';
        }
        getData(0, 'CNY=X', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
          let currentPrice = price;
          let previousPrice = prevClose;
          chag[3] = String(currentPrice - previousPrice);
          perc[3] = String(((price - prevClose) / prevClose) * 100);
          prices[3] = currentPrice;
          if (Math.sign(chag[3]) > 0) {
            dir[3] = '+';
          } else {
            dir[3] = '';
          }


          let euro = prices[3] + " " + dir[3] + Math.round(10 * chag[3]) / 10 + ' (' + Math.round(10 * perc[3]) / 10 + '%' + ')';
          let japan = prices[2] + " " + dir[2] + Math.round(10 * chag[2]) / 10 + ' (' + Math.round(10 * perc[2]) / 10 + '%' + ')';
          let russia = prices[1] + " " + dir[1] + Math.round(10 * chag[1]) / 10 + ' (' + Math.round(10 * perc[1]) / 10 + '%' + ')';
          let canada = prices[0] + " " + dir[0] + Math.round(10 * chag[0]) / 10 + ' (' + Math.round(10 * perc[0]) / 10 + '%' + ')';
          var result = [];

          result.push({ "EUR/USD": euro });
          result.push({ "USD/JPY": japan });
          result.push({ "USD/RUB": russia });
          result.push({ "RUS/CAD": canada });

          res.contentType('application/json');
          res.send(JSON.stringify(result));
        });
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
  getData(0, '^GSPE', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
    let currentPrice = price;
    let previousPrice = prevClose;
    let chg = currentPrice - previousPrice;
    let pct = ((price - prevClose) / prevClose) * 100;
    console.log('CHANGE: ' + chg);
    console.log('PERCENT: ' + pct);

    chag[0] = String(chg);
    perc[0] = String(pct);
    prices[0] = currentPrice;

    if (Math.sign(chag[0]) > 0) {
      dir[0] = '+';
    } else {
      dir[0] = '';
    }
    getData(0, '^SPCSEFP', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
      let currentPrice = price;
      let previousPrice = prevClose;
      chag[1] = String(currentPrice - previousPrice);
      perc[1] = String(((price - prevClose) / prevClose) * 100);
      prices[1] = currentPrice;
      if (Math.sign(chag[1]) > 0) {
        dir[1] = '+';
      } else {
        dir[1] = '';
      }
      console.log(chag[0]);
      getData(0, '^SP500-20', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
        let currentPrice = price;
        let previousPrice = prevClose;
        chag[2] = String(currentPrice - previousPrice);
        perc[2] = String(((price - prevClose) / prevClose) * 100);
        prices[2] = currentPrice;
        if (Math.sign(chag[2]) > 0) {
          dir[2] = '+';
        } else {
          dir[2] = '';
        }
        getData(0, '^SP500-60', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
          let currentPrice = price;
          let previousPrice = prevClose;
          chag[3] = String(currentPrice - previousPrice);
          perc[3] = String(((price - prevClose) / prevClose) * 100);
          prices[3] = currentPrice;
          if (Math.sign(chag[3]) > 0) {
            dir[3] = '+';
          } else {
            dir[3] = '';
          }
          getData(0, '^SP500-45', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
            let currentPrice = price;
            let previousPrice = prevClose;
            chag[4] = String(currentPrice - previousPrice);
            perc[4] = String(((price - prevClose) / prevClose) * 100);
            prices[4] = currentPrice;
            if (Math.sign(chag[4]) > 0) {
              dir[4] = '+';
            } else {
              dir[4] = '';
            }
            getData(0, '^SP500-15', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
              let currentPrice = price;
              let previousPrice = prevClose;
              chag[5] = String(currentPrice - previousPrice);
              perc[5] = String(((price - prevClose) / prevClose) * 100);
              prices[5] = currentPrice;
              if (Math.sign(chag[5]) > 0) {
                dir[5] = '+';
              } else {
                dir[5] = '';
              }
              getData(0, '^SP500-30', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
                let currentPrice = price;
                let previousPrice = prevClose;
                chag[6] = String(currentPrice - previousPrice);
                perc[6] = String(((price - prevClose) / prevClose) * 100);
                prices[6] = currentPrice;
                if (Math.sign(chag[6]) > 0) {
                  dir[6] = '+';
                } else {
                  dir[6] = '';
                }
                getData(0, '^SP500-35', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
                  let currentPrice = price;
                  let previousPrice = prevClose;
                  chag[7] = String(currentPrice - previousPrice);
                  perc[7] = String(((price - prevClose) / prevClose) * 100);
                  prices[7] = currentPrice;
                  if (Math.sign(chag[7]) > 0) {
                    dir[7] = '+';
                  } else {
                    dir[7] = '';
                  }
                  getData(0, '^SP500-25', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
                    let currentPrice = price;
                    let previousPrice = prevClose;
                    chag[8] = String(currentPrice - previousPrice);
                    perc[8] = String(((price - prevClose) / prevClose) * 100);
                    prices[8] = currentPrice;
                    if (Math.sign(chag[8]) > 0) {
                      dir[8] = '+';
                    } else {
                      dir[8] = '';
                    }
                    getData(0, '^SP500-55', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
                      let currentPrice = price;
                      let previousPrice = prevClose;
                      chag[9] = String(currentPrice - previousPrice);
                      perc[9] = String(((price - prevClose) / prevClose) * 100);
                      prices[9] = currentPrice;
                      console.log('utility change: ' + Math.sign(chag[9]) + " " + chag[9]);
                      if (Math.sign(chag[9]) > 0) {
                        dir[9] = '+';
                      } else {
                        dir[9] = '';
                      }
                      getData(0, '^SP500-50', function (symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
                        let currentPrice = price;
                        let previousPrice = prevClose;
                        chag[10] = String(currentPrice - previousPrice);
                        perc[10] = String(((price - prevClose) / prevClose) * 100);
                        prices[10] = currentPrice;
                        if (Math.sign(chag[10]) > 0) {
                          dir[10] = '+';
                        } else {
                          dir[10] = '';
                        }
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
    res.send('RUSSIA STOCK INDEX ' + dir + Math.round(10 * chg) / 10 + ' (' + Math.round(10 * pct) / 10 + '%' + ')');

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
    res.send('US STOCK INDEX ' + dir + Math.round(10 * chg) / 10 + ' (' + Math.round(10 * pct) / 10 + '%' + ')');

  });
});
//64756853857=1921

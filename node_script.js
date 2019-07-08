const KEYWORD = "facebook";
const STOCKNAME = "fb";
let listData = [];

function getSentiment(string) {
  var Sentiment = require("sentiment");
  var sentiment = new Sentiment();
  var result = sentiment.analyze(string);
  return result["comparative"];
}

function writeToFile(data) {
  let fs = require("fs");
  //var fileContent = data;

  fs.appendFile("./data.csv", JSON.stringify(data) + ",\n", err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been updated");
  });
}

//unused for the moment
function getTimeRemaining() {
  var moment = require("moment");
  let now = new moment();
  let deadline = now
    .clone()
    .hour(21)
    .minute(0)
    .second(0);
  if (now.isAfter(deadline)) {
    let tomorrow = moment(new Date())
      .add(1, "days")
      .hour(21)
      .minute(0)
      .second(0);
    console.log(tomorrow.from(now));
  } else {
    console.log(deadline.from(now));
  }
}

function getStockValue() {
  let yahooStockPrices = require("yahoo-stock-prices");
  yahooStockPrices.getCurrentPrice(STOCKNAME, function(err, price) {
    console.log(price);
    return price;
  });
}

function getRedditSentValue() {
  let url = "https://www.reddit.com/search.json?sort=new&q=" + KEYWORD;
  let total = 0;
  let stockPrice = getStockValue();
  ("use strict");
  let request = require("request");
  request.get(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" }
    },
    (err, res, data) => {
      if (err) {
        console.log("Error:", err);
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode);
      } else {
        for (let i = 0; i < data["data"]["children"].length; i++) {
          listData.push(
            getSentiment(data["data"]["children"][i]["data"]["title"])
          );
        }
        for (let i = 0; i < listData.length; i++) {
          total += listData[i];
        }
        total = (total / listData.length).toFixed(4);
        console.log("Sentiment: " + total + " - Stock: " + stockPrice);
        writeToFile("Sentiment: " + total + " - Stock: " + stockPrice);

        
      }
    }
  );
}

//getTimeRemaining();
//getStockValue();
getRedditSentValue();
//getStockValue();

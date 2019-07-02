function getSentiment(string) {
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    var result = sentiment.analyze(string);
    console.dir(result);
    writeToFile(result);
}

function writeToFile(data) {
    var fs = require("fs");
    //var fileContent = data;

    fs.writeFile("./data.txt", JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });

}

getSentiment("I hate cats, but I am allergic to them.");
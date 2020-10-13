const ft = require("./ft.js");
const fs = require("fs");
const { Parser } = require("json2csv");
const cliProgress = require("cli-progress");

const yahooFinance = require("yahoo-finance");

(async () => {
  let data = await ft.getFreetradeStocks();

  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  // Start progress bar
  bar1.start(data.length, 0);

  for (let i = 0; i < data.length; i++) {
    let quote = {};
    try {
      quote = await yahooFinance.quote({
        symbol:
          data[i].symbol.replace(/\.$/, "") + // remove trailing .
          (data[i].mic === "XLON" ? ".L" : ""), // Add .L for London stocks
        modules: ["price"], // see the docs for the full list
      });
    } catch (err) {
      console.log(err);
    }

    data[i] = Object.assign(data[i], quote.price);

    // Update progress bar
    bar1.update(i + 1);
  }

  bar1.stop();

  fs.writeFileSync("stocks.json", JSON.stringify(data));
  fs.writeFileSync;

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);

  fs.writeFileSync("stocks.csv", csv);
})();

# Freetrade Stock Universe Quotes

This code fetches the current Freestrade's stocks universe and then add the current quote fetched from Yahoo and outputs a CSV and JSON file with the combined data.

[Freetrade Stock Universe](https://freetrade.io/stock-list)

## Requirements

- Google Sheets API Key
- Node.js with NPM

## Get Google Sheets API Key

On the Google Quickstart guide linked below, use the `Enable the Google Sheets API` button to create an API key and download `credentials.json` to the project directory.

[Google Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)

## Setup

```
npm install
```

## Usage

Run the following:

```
node app.js
```

On first run follow the instructions to get an API token for Google sheets.

Outputs:

- stocks.csv
- stocks.json

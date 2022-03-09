// custom menu
var sortVar = 1;
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("NFT Data")
    .addItem("Get NFT Data", "displayNFTData")
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu("Sort the data")
        .addItem("by Name", "sortN")
        .addItem("by Volume", "sortV")
        .addItem("by Transaction Count", "sortTC")
        .addItem("by Market Capital", "sortMC")
        .addItem("by Max Price", "sortMP")
    )
    .addToUi();
}

function callCovalentAPI() {
  // Call the Covalent API
  var response = UrlFetchApp.fetch(
    "https://api.covalenthq.com/v1/1/nft_market/?key=ckey_ca8b6bd524ce4cc4a4d1a28ac19"
  );

  // Parse the JSON reply
  var json = response.getContentText();
  return JSON.parse(json);
}

function displayNFTData() {
  // pick up the search term from the Google Sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var results = callCovalentAPI()["data"]["items"];

  var output = [];

  results.forEach(function (elem, i) {
    var image = '=image("' + elem["first_nft_image_1024"] + '",4,60,60)';
    output.push([
      elem["chain_id"],
      elem["collection_name"],
      elem["collection_address"],
      elem["avg_volume_quote_24h"],
      elem["market_cap_quote"],
      elem["transaction_count_alltime"],
      elem["unique_wallet_purchase_count_alltime"],
      elem["max_price_quote"],
      elem["floor_price_quote_7d"],
      image,
    ]);
    sheet.setRowHeight(i + 2, 65);
  });

  var sortedOutput = output.sort(function (a, b) {
    var dataA = a[sortVar] ? a[sortVar] : "Not known";
    var dataB = b[sortVar] ? b[sortVar] : "Not known";

    if (dataA < dataB) {
      return 1;
    } else if (dataA > dataB) {
      return -1;
    }
    // names are equal
    return 0;
  });
  output = sortedOutput;
  var len = output.length;

  // clear any previous content
  sheet.getRange(2, 1, 500, 10).clearContent();

  // paste in the values
  sheet.getRange(2, 1, len, 10).setValues(output);

  // formatting
  sheet.getRange(2, 1, 500, 10).setVerticalAlignment("middle");
  sheet.getRange(2, 5, 500, 1).setHorizontalAlignment("center");
  sheet.getRange(2, 2, len, 3).setWrap(true);
}

function sortN() {
  sortVar = 1;
  displayNFTData();
}
function sortV() {
  sortVar = 3;
  displayNFTData();
}
function sortMC() {
  sortVar = 4;
  displayNFTData();
}
function sortTC() {
  sortVar = 5;
  displayNFTData();
}
function sortMP() {
  sortVar = 6;
  displayNFTData();
}

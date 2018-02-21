var user_amount = 0;
var base_curr = 'USD';
var convert_curr = 'MYR';
var user_base = undefined;
var user_convert = undefined;
var title = '';
var symbol_currency_map = new Object();

var dailyData = '';
//updated field
var dailyDataArray;

function init(){
  $.getJSON("http://api.fixer.io/latest", storeDailyData);
  setSymbolCurrencyMap();
}

var storeDailyData = function(data){
  dailyData = data;
  console.log(JSON.stringify(data));
  var obj = dailyData.rates;
  var result = Object.keys(obj).map(function(e) {
    return [(e), obj[e]];
  });
  dailyDataArray = result;
}

init();

var makeTitle = function(){
  let gettingItem = browser.storage.local.get();
  gettingItem.then(onGot, onError);
}

function onGot(item){
  console.log(item);
  var emptyObj = isEmpty(item);
  if((! emptyObj)){
    if(item.base_curr.name && item.convert_curr.name){
      user_base = item.base_curr.name;
      user_convert = item.convert_curr.name;
      title = "Convert from "+ user_base + " " + " to " + " " + user_convert;
      browser.contextMenus.create({
        id: "log-selection",
        title: title,
        contexts: ["selection"]
      });
    }
  }else{
    browser.contextMenus.create({
      id: "log-selection",
      title: "Select exchange currency to get started.",
      contexts: ["selection"]
    });

    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
      "title": "Getting Started",
      "message": "Please select the exchange currency to get started. Click on the icons on toolbar."
    });
  }
}

makeTitle();

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "log-selection") {
    convert(info.selectionText);
  }
});

function convert(variable){
  var amount = variable.trim();
  

  // two million, ten thousand and a half is 2,010,000.5
  var common_num_format = /^\d+(,\d+)+(.\d*)?$/; 

  // two million, ten thousand and a half is 2.010.000,5
  var european_num_format = /^\d+(.\d+){2,}(,\d*)?$/; 

  if(!isNaN(amount)){
    user_amount = Number(amount);
    currency_convert();

  }else if(common_num_format.test(amount)){
    var all_commas = /,/g;
    plain_amount = amount.replace(all_commas, '');
    console.log('Common format amount ' + amount + ' is now: ' + plain_amount);
    user_amount = Number(plain_amount);
    currency_convert();

  }else if(european_num_format.test(amount)){
    var all_dots = /\./g;
    plain_amount = amount.replace(all_dots, '');
    //replace decimal comma with decimal dot that Number understands
    plain_amount = plain_amount.replace(',', '.');
    console.log('European format amount ' + amount + ' is now: ' + plain_amount);
    user_amount = Number(plain_amount);
    currency_convert();

  }else{
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
      "title": "Oops! Cannot convert this.",
      "message": "Highlight only numbers to convert, without symbols or characters."
    });
  }
}

function currency_convert() {
  let get_user_base = browser.storage.local.get();
  get_user_base.then(onGotConvert, onError);
}

function onGotConvert(item){
  console.log(item);
  var emptyObj = isEmpty(item);
  if((!emptyObj)){
    if(item.base_curr.name && item.convert_curr.name){
      base_curr = item.base_curr.name;
      convert_curr = item.convert_curr.name;

      //Update 0.1, new field for eur currencies
      if(base_curr === "EUR" || convert_curr === "EUR"){
        if(base_curr === "EUR"){
          var convert_rate;
          var converted_amount;
          for(var n = 0; n < dailyDataArray.length; n++){
            if(convert_curr === dailyDataArray[n][0]){
              convert_rate = dailyDataArray[n][1];
              converted_amount = user_amount * convert_rate;
              converted_amount = Math.round(converted_amount * 100) / 100;
            }
          }
          browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
            "title": "Immediate Currency Converter",
            "message": base_curr + " " + user_amount + " = " + convert_curr + " " + converted_amount
          });
          console.log(convert_rate);
        }
        if(convert_curr === "EUR"){
          var convert_rate;
          var converted_amount;
          for(var n = 0; n < dailyDataArray.length; n++){
            if(base_curr === dailyDataArray[n][0]){
              convert_rate = dailyDataArray[n][1];
              converted_amount = user_amount / convert_rate;
              converted_amount = Math.round(converted_amount * 100) / 100;
            }
          }
          browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
            "title": "Immediate Currency Converter",
            "message": base_curr + " " + user_amount + " = " + convert_curr + " " + converted_amount
          });
        }
        //Update 0.1 end here.
      }else{
        if(base_curr && convert_curr){
          fx.rates = dailyData.rates;
          var rate = fx(user_amount).from(base_curr).to(convert_curr);
          console.log(base_curr + " " + user_amount + " = " + convert_curr + " " + rate.toFixed(2));

          browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
            "title": "Immediate Currency Converter",
            "message": base_curr + " " + user_amount + " = " + convert_curr + " " + rate.toFixed(2)
          });
        }
      }
    }
  }else{
    fx.rates = data.rates;
    var rate = fx(user_amount).from(base_curr).to(convert_curr);
    console.log(base_curr + " " + user_amount + " = " + convert_curr + " " + rate.toFixed(4));

    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
      "title": "Base currency not set, assume USD",
      "message": base_curr + " " + user_amount + " = " + convert_curr + " " + rate.toFixed(2)
    });
  }
}


function onGotB(item) {
  //console.log(item);
  console.log(item.base_curr.name);
  user_base = item.base_curr.name;
}

function onGotC(item) {
  //console.log(item);
  console.log(item.convert_curr.name);
  user_convert = item.convert_curr.name;
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  //return true;
  return JSON.stringify(obj) === JSON.stringify({});
}

// Currency symbol info largely taken from https://github.com/xsolla/currency-format/
function setSymbolCurrencyMap() {
  symbol_currency_map = {
      "A$": "AUD",
      "лв": "BGN",
      "R$": "BRL",
      "CA$": "CAD",
      "SFr": "CHF",
      "元": "CNY",
      "Kč": "CZK",
      // "kr": "DKK", //kr is used for three currencies, not unique enough to use
      "€": "EUR",
      "£": "GBP",
      "HK$": "HKD",
      "Ft": "HUF",
      "Rp": "IDR",
      "₪": "ILS",
      "₹": "INR",
	  "Rs": "INR",
      "¥": "JPY",
      "₩": "KRW",
      "Mex$": "MXN",
      "RM": "MYR",
      //"kr": "NOK",
      "NZ$": "NZD",
      "₱": "PHP",
      "zł": "PLN",
      "lei": "RON",
      "₽": "RUB",
      //"kr": "SEK",
      "S$": "SGD",
      "฿": "THB",
      "₺": "TRY",
      "$": "USD",
      "R": "ZAR"
  };
}


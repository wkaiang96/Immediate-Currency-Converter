var title = '';

var dailyData = '';
//updated fields
var dailyDataArray;
var symbol_currency_map;
var dataHeader = "imm_";
//sidebar
var valListLocal;
var myWindowId;
var currBody = document.querySelector("body");

function init(){  
  var todayDate = getTodayDate();
  var todayData = JSON.parse(localStorage.getItem(dataHeader + todayDate));  
  if(todayData == null){  
    clearStorage();
    // change another currency provider
    // $.getJSON("http://data.fixer.io/api/latest?access_key=56fea1865ff2aec49f03f405ebb4a9f5&format=1", function(data){
    //   storeDailyData(data)
    // });
    retrieveDailyRate(); 
    setSymbolCurrencyMap();
  }else{
    storeDailyData(todayData);
    setSymbolCurrencyMap();
  }
}

function retrieveDailyRate(){
  var rateObj = {
    success : true,
    timestamp : Date.now(),
    date : '',
    base : 'EUR',
    rates : {}
  };
  var xhttp = new XMLHttpRequest();          
  //changed endpoint to retrieve currency rates
  xhttp.open("GET", "http://immcurr.appec.work/v1/exchgrate", false);
  xhttp.setRequestHeader("Content-Type", "text/xml");
  xhttp.send(null);  
  var doc = xhttp.responseXML;       
  var cubeTag = doc.getElementsByTagName("Cube");
  var dateData = cubeTag[1].getAttribute('time');
  var rateArray = [];    
  for (var i = 2; i < cubeTag.length; i++) {      
    rateObj.rates[cubeTag[i].getAttribute('currency')] = cubeTag[i].getAttribute('rate');            
  }
  rateObj.date = dateData;    
  //console.log(JSON.stringify(rateObj));
  storeDailyData(rateObj);
}

var storeDailyData = function(data){
  dailyData = data;
  var todayDate = getTodayDate();    
  if(localStorage.key(dataHeader + todayDate) == null){
    localStorage.setItem(dataHeader + todayDate, JSON.stringify(dailyData));
  }
  //console.log(JSON.stringify(data));
  var obj = dailyData.rates;
  var result = Object.keys(obj).map(function(e) {
    return [(e), obj[e]];
  });
  dailyDataArray = result;  
}

init();

function clearStorage(){
  var arr = []; // Array to hold the keys
  // Iterate over localStorage and insert the keys that meet the condition into arr
  for (var i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).substring(0,4) == 'imm_') {
        arr.push(localStorage.key(i));
    }
  }

  // Iterate over arr and remove the items by key
  for (var i = 0; i < arr.length; i++) {
    localStorage.removeItem(arr[i]);
  }    
}

function getTodayDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  } 

  if(mm<10) {
      mm = '0'+mm
  } 

  today = mm + dd + yyyy;
  return today;
}
var makeTitle = function(){
  let gettingItem = browser.storage.local.get();
  gettingItem.then(onGot, onError);
}

function onGot(item){
  console.log(item);
  var emptyObj = isEmpty(item);
  if((! emptyObj)){
    if(item.base_curr.name && item.convert_curr.name){
      var base_curr = item.base_curr.name;
      var convert_curr = item.convert_curr.name;
      valListLocal = item.valListLocal;

      title = "Convert from " + base_curr + " to " + convert_curr;
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

// object constructor
function Conversion(selection_text) {
  this.selection = selection_text;
  this.amount = undefined;
  this.base_curr = undefined;
  this.convert_curr = undefined;
  this.converted_amount = undefined;
  this.extra_msg_text = '';
};

var current_conversion; //global object to hold conversion data

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "log-selection") {
    current_conversion = new Conversion(info.selectionText);
    current_conversion.start_conversion();
  }
});

Conversion.prototype.start_conversion = function() {
  this.currency_symbol_check();
  this.get_amount();

  if (this.amount == null || isNaN(this.amount)) {
    show_browser_notification({
      "message": "Highlight only numbers to convert, without symbols or characters.",
      "title":   "Oops! Cannot convert this."});
    return;
  }

  this.set_currencies();
}

Conversion.prototype.set_currencies = function () {
  let gettingItem = browser.storage.local.get();
  gettingItem.then(function(item) { current_conversion.onGotCurr(item) }, onError);
}

Conversion.prototype.onGotCurr = function (item){
  console.log(item);
  var default_base_curr = 'USD';
  var default_convert_curr = 'MYR';

  if(isEmpty(item)) {
    this.extra_msg_text = "(Currencies not set, assuming USD for base and MYR for target currency.)";
    this.base_curr = default_base_curr;
    this.convert_curr = default_convert_curr;
    return;
  }

  if(item.convert_curr.name){
    this.convert_curr = item.convert_curr.name;
  }
  else {
    this.extra_msg_text = "(Target currency not set, assuming MYR for target currency.)";
    this.convert_curr = default_convert_curr;
  }

  // if base_curr is not already set (from currency_symbol_check), then set it here
  if (!this.base_curr) {
    if(item.base_curr.name) {
      this.base_curr = item.base_curr.name;
    }
    else {
      this.extra_msg_text = "(Base currency not set, assuming USD for base currency.)";
      this.base_curr = default_base_curr;
    }
  }

  this.finish_conversion();
}

Conversion.prototype.get_amount = function () {
  var amount_str = this.selection;

  // two million, ten thousand and a half is 2,010,000.5 in "common" format (US, Asia, etc.)
  var common_num_format = /^\d+(,\d+)+(.\d*)?$/; 

  // two million, ten thousand and a half is 2.010.000,5 in European format
  var european_num_format = /^\d+(.\d+){2,}(,\d*)?$/; 

  if(!isNaN(amount_str)){
    this.amount = Number(amount_str);

  }else if(common_num_format.test(amount_str)){
    var all_commas = /,/g;
    plain_amount = amount_str.replace(all_commas, '');
    console.log('Common format amount ' + amount_str + ' is now: ' + plain_amount);
    this.amount = Number(plain_amount);

  }else if(european_num_format.test(amount_str)){
    var all_dots = /\./g;
    plain_amount = amount_str.replace(all_dots, '');
    //replace decimal comma with decimal dot that Number understands
    plain_amount = plain_amount.replace(',', '.');
    console.log('European format amount ' + amount_str + ' is now: ' + plain_amount);
    this.amount = Number(plain_amount);

  }
  else {
    this.amount = NaN;
  }
}


// Check if selection includes currency indicator
// (either as a symbol like "$" or as an acronym like "USD")
Conversion.prototype.currency_symbol_check = function () {
  selection = this.selection.trim();

  text_at_start = /^(\D+?)[ .]*\d/;
  text_at_end   = /\d\.?\s*(\D+?)\.?$/;

  match         = selection.match(text_at_start);
  if (!match) {
    match       = selection.match(text_at_end);
  }

  if (match) { 
    text = currency_text = match[1].trim();
    // if the text is one of the symbols in the list like ₹ or €
    if(text in symbol_currency_map) {
      currency_text = symbol_currency_map[text];
    } 

    // if the text is one of the currency abbreviations like CAD or JPY
    if(currency_text in dailyData.rates || currency_text === dailyData.base) {
      // currency marker found, set that value in this
      this.base_curr = currency_text;
      console.log('Temporary user base currency set to: ' + currency_text);

      // remove currency marker from selection text so that the amount can be parsed next
      // allows for dot after currency text, for eg "Rs. 45" will become just 45
      text = text.replace(/\$/, '\\$'); // treat $ as a character here, not as special RegExp symbol
      text_re = new RegExp(text + '((\\.\\s)|(\\.\\s*$))?');
      this.selection = selection.replace(text_re, '').trim();
    }
  }
}

Conversion.prototype.finish_conversion = function () {
  if(this.base_curr === "EUR" || this.convert_curr === "EUR"){
    if(this.base_curr === "EUR"){
      var convert_rate;
      for(var n = 0; n < dailyDataArray.length; n++){
        if(this.convert_curr === dailyDataArray[n][0]){
          convert_rate = dailyDataArray[n][1];
          this.converted_amount = this.amount * convert_rate;
          this.converted_amount = Math.round(this.converted_amount * 100) / 100;
        }
      }
      onAddVal(this.base_curr, this.convert_curr, this.user_amount, this.converted_amount.toFixed(2));
      console.log(convert_rate);      
    }
    if(this.convert_curr === "EUR"){
      var convert_rate;
      for(var n = 0; n < dailyDataArray.length; n++){
        if(this.base_curr === dailyDataArray[n][0]){
          convert_rate = dailyDataArray[n][1];
          this.converted_amount = this.amount / convert_rate;
          this.converted_amount = Math.round(this.converted_amount * 100) / 100;
        }
      }
      onAddVal(this.base_curr, this.convert_curr, this.user_amount, this.converted_amount.toFixed(2));      
    }
  }else{
    if(this.base_curr && this.convert_curr){
      fx.rates = dailyData.rates;
      var rate = fx(this.amount).from(this.base_curr).to(this.convert_curr);
      this.converted_amount = rate.toFixed(2);
      onAddVal(this.base_curr, this.convert_curr, this.user_amount, rate.toFixed(2));
    }
  }
  console.log(this);
  show_browser_notification({
    "message": this.base_curr + " " + this.amount + " = " + this.convert_curr + " " + this.converted_amount +
      "\n" + this.extra_msg_text
  });
}

function show_browser_notification({message, title = "Immediate Currency Converter"}) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
    "title": title,
    "message": message
  });
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

function onAddVal(base_curr, convert_curr, base_val, convert_val){
  if(valListLocal !== undefined){
    if(valListLocal.length > 10){
      valListLocal.splice(0,1);
    }
  }else{
    valListLocal = [];
  }
  valListLocal.push({"base_curr": base_curr, "convert_curr": convert_curr, "base_val": base_val, "convert_val": convert_val});
  onSaveVal(valListLocal);
}

function onSaveVal(c_val){
  if(valListLocal !== undefined){
    if(valListLocal.length > 0){
      let removeVal =  browser.storage.local.remove("valListLocal");
      removeVal.then(onRemoved, onError);
    }
  }
  valListLocal = c_val;
  let storingVal = browser.storage.local.set({valListLocal});
  storingVal.then(null, onError);

  var sending = browser.runtime.sendMessage("update");
  
}

function onRemoved() {
  console.log("OK");
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

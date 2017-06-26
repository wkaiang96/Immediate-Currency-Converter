var user_amount = 0;
var base_curr = 'USD';
var convert_curr = 'MYR';
var user_base = "undefined";
var user_convert = "undefined";
var title = '';
var dailyData = '';

function init(){
  $.getJSON("http://api.fixer.io/latest", storeDailyData);
}

var storeDailyData = function(data){
  dailyData = data;
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

function onGotConvert(item){
  console.log(item);
  var emptyObj = isEmpty(item);
  if((!emptyObj)){  
    if(item.base_curr.name && item.convert_curr.name){
      base_curr = item.base_curr.name;
      convert_curr = item.convert_curr.name;
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


function currency_convert() {
  let get_user_base = browser.storage.local.get();
  get_user_base.then(onGotConvert, onError);
}

function convert(variable){
   var amount = variable;
   if(! isNaN(amount)){
      user_amount = Number(amount);
      currency_convert();
   }else{
     browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
      "title": "Ops! Cannot convert this.",
      "message": "Highlight only numbers to convert, without symbols or characters."
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
var user_base = '';
var user_convert = '';

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
      var onUpdatedMenu = browser.contextMenus.update("log-selection",{
        title: title});
      onUpdatedMenu.then(onUpdated, onError);
    }
  }else{
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/curr_converter-100.png"),
      "title": "Select both base and convert value",
      "message": "Please select the base currency and converting currency"
    });
  }
}

function onUpdated() {
  console.log("item updated successfully");
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGotB(item) {
  //console.log(item);
  console.log(item.base_curr.name);
  user_base = item.base_curr.name;
}

function onGotC(item){
  console.log(item.convert_curr.name);
  user_convert = item.convert_curr.name;
}

function isEmptyObject(obj) {
  if (obj.length && obj.length > 0){
     return false;          
  }
  if (obj.length === 0){
    return true;        
  }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    //return true;
    return JSON.stringify(obj) === JSON.stringify({});
}  

document.addEventListener("click", (e) => {

  let base_curr = {
    name: "USD"
  };

  let convert_curr = {
    name: "MYR"
  }

  function getCurrentWindow() {
    return browser.windows.getCurrent();
  }

  function uncheckLastBaseSelection(item){
   if(item.name){
    var last_selection = "b_" + item.name;
    var lastSelection = document.getElementById(last_selection);
    lastSelection.style.border = '';
    lastSelection.style.background = '#fbfbfb';
    lastSelection.style.color = '#000';
  }
}

function checkNewBaseSelection(selection){
  var new_selection = "b_" + selection.name;
  var base_selection = document.getElementById(new_selection);
  base_selection.style.border = '3px solid green';
  base_selection.style.backgroundColor ='#15bd8d';
  base_selection.style.color = '#fff';
  let result = browser.storage.local.set({base_curr});
  result.then(null, onError);
}

function uncheckLastConvertSelection(item){
   if(item.name){
    var last_selection = "c_" + item.name;
    var lastSelection = document.getElementById(last_selection);
    lastSelection.style.border = '';
    lastSelection.style.background = '#fbfbfb';
    lastSelection.style.color = '#000';
  }
}

function checkNewConvertSelection(selection){
  var new_selection = "c_" + selection.name;
  var base_selection = document.getElementById(new_selection);
  base_selection.style.border = '3px solid green';
  base_selection.style.backgroundColor ='#15bd8d';
  base_selection.style.color = '#fff';
  let result = browser.storage.local.set({convert_curr});
  result.then(null, onError);
}

  if (e.target.id === "window-update-minimize") {
    getCurrentWindow().then((currentWindow) => {
      var updateInfo = {
        state: "minimized"
      };

      browser.windows.update(currentWindow.id, updateInfo);
    });
  }
  else if(e.target.id === "b_AUD"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "AUD";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_AUD"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "AUD";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_BGN"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "BGN";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_BGN"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "BGN";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_BRL"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "BRL";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_BRL"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "BRL";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_CAD"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "CAD";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_CAD"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "CAD";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_CHF"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "CHF";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_CHF"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "CHF";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_CNY"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "CNY";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_CNY"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "CNY";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_CZK"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "CZK";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_CZK"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "CZK";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_DKK"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "DKK";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_DKK"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "DKK";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }
  
  else if(e.target.id === "b_EUR"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "EUR";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_EUR"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "EUR";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_GBP"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "GBP";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_GBP"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "GBP";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_HKD"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "HKD";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_HKD"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "HKD";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_HUF"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "HUF";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_HUF"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "HUF";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_IDR"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "IDR";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_IDR"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "IDR";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_ILS"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "ILS";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_ILS"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "ILS";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_INR"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "INR";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_INR"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "INR";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_JPY"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "JPY";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_JPY"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "JPY";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_KRW"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "KRW";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_KRW"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "KRW";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_MXN"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "MXN";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_MXN"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "MXN";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_MYR"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "MYR";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_MYR"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "MYR";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_NOK"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "NOK";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_NOK"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "NOK";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_NZD"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "NZD";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_NZD"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "NZD";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_PHP"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "PHP";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_PHP"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "PHP";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_PLN"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "PLN";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_PLN"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "PLN";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_RON"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "RON";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_RON"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "RON";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_RUB"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "RUB";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_RUB"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "RUB";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_SEK"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "SEK";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_SEK"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "SEK";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_SGD"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "SGD";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_SGD"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "SGD";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_THB"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "THB";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_THB"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "THB";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_TRY"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "TRY";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_TRY"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "TRY";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_USD"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "USD";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_USD"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "USD";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  else if(e.target.id === "b_ZAR"){
      uncheckLastBaseSelection(base_curr);
      base_curr.name = "ZAR";
      checkNewBaseSelection(base_curr);
      makeTitle();
  }

  else if(e.target.id === "c_ZAR"){
      uncheckLastConvertSelection(convert_curr);
      convert_curr.name = "ZAR";
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  e.preventDefault();
});

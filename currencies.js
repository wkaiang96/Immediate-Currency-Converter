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
  else if(e.target.id.startsWith("b_")){
      uncheckLastBaseSelection(base_curr);
      // extract the part of the id after "b_"
      base_curr.name = e.target.id.slice(2);
      checkNewBaseSelection(base_curr);
      makeTitle();
  }
  else if(e.target.id.startsWith("c_")){
      uncheckLastConvertSelection(convert_curr);
      // extract the part of the id after "c_"
      convert_curr.name = e.target.id.slice(2);
      checkNewConvertSelection(convert_curr);
      makeTitle();
  }

  e.preventDefault();
});

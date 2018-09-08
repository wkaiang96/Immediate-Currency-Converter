var myWindowId;
var valListLocal;

/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
  var contentBox = document.querySelector("#content");
  var table = '';
  var latestPos = 0;
  browser.tabs.query({windowId: myWindowId, active: true})
    .then((tabs) => {
      return browser.storage.local.get();
    })
    .then((storedInfo) => {
      //contentBox.textContent = JSON.stringify(storedInfo.valListLocal);
      table = '<table id="valTable" width="90%">';
      for(var n = 0; n < storedInfo.valListLocal.length; n++){
        table += "<tr><td width='60%' align='left'>" + storedInfo.valListLocal[n].base_curr + " to " +storedInfo.valListLocal[n].convert_curr+"</td><td width='20%' aligh='right'><input type='text' style='width:90%; border: 0 none transparent;' id='c_val"+n+"' value='" + storedInfo.valListLocal[n].convert_val +"'/></td><td width='10%' align='right'><button class='default' id='c_val"+n+"_btn'>Copy</button></td></tr>"
      }
      table += '</table>';
      contentBox.innerHTML = table;
      for(var n = 0; n < storedInfo.valListLocal.length; n++)      {
        var el = document.getElementById("c_val" + n + "_btn");
        el.addEventListener("click", copyValue, false);
      }
    });
}

function copyValue(){
  var str = this.id;
  var elemId = str.replace("_btn", "");
  var copyText = document.getElementById(elemId);
  copyText.select();
  var bool = document.execCommand('copy');  
}

//used to copy last converted value
function copyValueLatest(pos){  
  var elemId = "c_val" + pos;
  var copyText = document.getElementById(elemId);
  copyText.select();
  var bool = document.execCommand('copy');  
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});

//receive message from another instance
browser.runtime.onMessage.addListener(updateContent);


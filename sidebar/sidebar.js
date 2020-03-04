var myWindowId;
var valListLocal;
var dataHeader = "imm_";
var dailyDataArray;
var dailyData;
listAllCurrencies();
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
  if (contentBox !== null) {
    browser.tabs.query({windowId: myWindowId, active: true})
    .then((tabs) => {
      return browser.storage.local.get();
    })
    .then((storedInfo) => {
      if (contentBox && storedInfo) {
        // console.log('contentbox', contentBox);
        //contentBox.textContent = JSON.stringify(storedInfo.valListLocal);
        if (storedInfo.valListLocal) {
          table = '<table id="valTable" width="90%">';
          for(var n = 0; n < storedInfo.valListLocal.length; n++){
            table += "<tr><td width='60%' align='left'>" + storedInfo.valListLocal[n].base_curr + " to " +storedInfo.valListLocal[n].convert_curr+"</td><td width='20%' aligh='right'><input type='text' style='width:90%; border: 0 none transparent;' id='c_val"+n+"' value='" + storedInfo.valListLocal[n].convert_val +"'/></td><td width='10%' align='right'><button class='default' id='c_val"+n+"_btn'>Copy</button></td></tr>"
          }
          table += '</table>';
          // if (contentBox !== null) {
            contentBox.innerHTML = table;
          // }
          for(var n = 0; n < storedInfo.valListLocal.length; n++)      {
            var el = document.getElementById("c_val" + n + "_btn");
            el.addEventListener("click", copyValue, false);
          }
        }
      }
    });
  }
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


function listAllCurrencies() {
  const dataKey = dataHeader + getTodayDate();
  var tmpData = localStorage.getItem(dataKey);
  if (tmpData) {
    dailyData = JSON.parse(tmpData);
  }
  if (dailyData) {
    const rates = dailyData.rates;
    const currenciesPanel = document.getElementById('currencies');
    const currenciesSelection = document.getElementById('currency-selection');
    var obj = dailyData.rates;
    var result = Object.keys(obj).map(function (e) {
      return [(e), obj[e]];
    });
    dailyDataArray = result;

    if (currenciesPanel) {
      Object.keys(rates).forEach(function(currency) {
        var span = document.createElement("span");
        span.innerText = currency;
        span.title = rates[currency];
        span.id = 's_' + currency;
        span.classList.add('currency-span')
        currenciesPanel.append(span);

        var input = document.createElement('input');
        input.value = 0;
        input.classList.add('currency-amount');
        input.id = 'in_' + currency;
        input.readOnly = true;
        document.getElementById('s_' + currency).appendChild(input);

        const select = document.getElementById('selection');
        if (select) {
          var option = document.createElement("option");
          option.value = currency;
          option.text = currency;
          if (currency === 'EUR') {
            option.selected = true;
          }
          select.add(option);
        }
      });
    }
  }
}

function getTodayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = mm + dd + yyyy;
  return today;
}

function conversion(base_curr, convert_curr, amount) {
  let converted_amount = 0;
  if (base_curr === "EUR" || convert_curr === "EUR") {
    if (base_curr === "EUR") {
      var convert_rate;
      for (var n = 0; n < dailyDataArray.length; n++) {
        if (convert_curr === dailyDataArray[n][0]) {
          convert_rate = dailyDataArray[n][1];
          converted_amount = amount * convert_rate;
          converted_amount = Math.round(converted_amount * 100) / 100;
        }
      }
    }
    if (convert_curr === "EUR") {
      var convert_rate;
      for (var n = 0; n < dailyDataArray.length; n++) {
        if (base_curr === dailyDataArray[n][0]) {
          convert_rate = dailyDataArray[n][1];
          converted_amount = amount / convert_rate;
          converted_amount = Math.round(this.converted_amount * 100) / 100;
        }
      }
    }
  } else {
    if (base_curr && convert_curr) {
      fx.rates = dailyData.rates;
      var rate = fx(amount).from(base_curr).to(convert_curr);
      converted_amount = rate.toFixed(2);
    }
  }
  return {currency: convert_curr, amount: converted_amount};
}

document.addEventListener('change', function(e) {
  const amount = document.getElementById('amount');
  console.log('on selection change', e.target.value);
  // const converted = conversion(e.target.value, 'USD', amount.value);
  // console.log('converted ', converted);
  if (dailyData) {
    const rates = dailyData.rates;
    Object.keys(rates).forEach(function(currency) {
      const currency_input = document.getElementById('in_' + currency);
      if (currency_input) {
        const converted = conversion(e.target.value, currency, amount.value);
        if (converted.amount !== NaN) {
          currency_input.value = converted.amount;
        } else {
          currency_input.value = 0;
        }
      }
    });
  }
});

document.addEventListener('input', function(e) {
  const selection = document.getElementById('selection');
  const amount = document.getElementById('amount');
  // const converted = conversion(selection.value, 'USD', amount.value);
  // console.log('input converted ', converted);
  if (dailyData) {
    const rates = dailyData.rates;
    Object.keys(rates).forEach(function(currency) {
      const currency_input = document.getElementById('in_' + currency);
      if (currency_input) {
        const converted = conversion(selection.value, currency, amount.value);
        if (converted.amount !== NaN) {
          currency_input.value = converted.amount;
        } else {
          currency_input.value = 0;
        }
      }
    });
  }
})

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

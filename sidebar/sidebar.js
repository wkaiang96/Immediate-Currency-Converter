var myWindowId;
var valListLocal;
var dataHeader = "imm_";
var dailyDataArray;
var dailyData;

setTimeout(function() {
  listAllCurrencies();
},1000);
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
    const rates = getfullCurrencies();
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
        span.innerHTML = currency;
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
          option.text = currency + '  (' + rates[currency] + ')';
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
  if (amount.value.toString().length === 0) {
    return false;
  }
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
  if (amount.value.toString().length === 0) {
    return false;
  }
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


function getfullCurrencies() {
  return {
    AED : "United Arab Emirates Dirham",
    AFN:	"Afghan Afghani",
    ALL:	"Albanian Lek",
    AMD:	"Armenian Dram",
    ANG:	"Netherlands Antillean Guilder",
    AOA:	"Angolan Kwanza",
    ARS:	"Argentine Peso",
    AUD:	"Australian Dollar",
    AWG:	"Aruban Florin",
    AZN:	"Azerbaijani Manat",
    BAM:	"Bosnia-Herzegovina Convertible Mark",
    BBD:	"Barbadian Dollar",
    BDT:	"Bangladeshi Taka",
    BGN:	"Bulgarian Lev",
    BHD:	"Bahraini Dinar",
    BIF:	"Burundian Franc",
    BMD:	"Bermudan Dollar",
    BND:	"Brunei Dollar",
    BOB:	"Bolivian Boliviano",
    BRL:	"Brazilian Real",
    BSD:	"Bahamian Dollar",
    BTC:	"Bitcoin",
    BTN:	"Bhutanese Ngultrum",
    BWP:	"Botswanan Pula",
    BYN:	"New Belarusian Ruble",
    BYR:	"Belarusian Ruble",
    BZD:	"Belize Dollar",
    CAD:	"Canadian Dollar",
    CDF:	"Congolese Franc",
    CHF:	"Swiss Franc",
    CLF:	"Chilean Unit of Account (UF)",
    CLP:	"Chilean Peso",
    CNY:	"Chinese Yuan",
    COP:	"Colombian Peso",
    CRC:	"Costa Rican Colón",
    CUC:	"Cuban Convertible Peso",
    CUP:	"Cuban Peso",
    CVE:	"Cape Verdean Escudo",
    CZK:	"Czech Republic Koruna",
    DJF:	"Djiboutian Franc",
    DKK:	"Danish Krone",
    DOP:	"Dominican Peso",
    DZD:	"Algerian Dinar",
    EGP:	"Egyptian Pound",
    ERN:	"Eritrean Nakfa",
    ETB:	"Ethiopian Birr",
    EUR:	"Euro",
    FJD:	"Fijian Dollar",
    FKP:	"Falkland Islands Pound",
    GBP:	"British Pound Sterling",
    GEL:	"Georgian Lari",
    GGP:	"Guernsey Pound",
    GHS:	"Ghanaian Cedi",
    GIP:	"Gibraltar Pound",
    GMD:	"Gambian Dalasi",
    GNF:	"Guinean Franc",
    GTQ:	"Guatemalan Quetzal",
    GYD:	"Guyanaese Dollar",
    HKD:	"Hong Kong Dollar",
    HNL:	"Honduran Lempira",
    HRK:	"Croatian Kuna",
    HTG:	"Haitian Gourde",
    HUF:	"Hungarian Forint",
    IDR:	"Indonesian Rupiah",
    ILS:	"Israeli New Sheqel",
    IMP:	"Manx pound",
    INR:	"Indian Rupee",
    IQD:	"Iraqi Dinar",
    IRR:	"Iranian Rial",
    ISK:	"Icelandic Króna",
    JEP:	"Jersey Pound",
    JMD:	"Jamaican Dollar",
    JOD:	"Jordanian Dinar",
    JPY:	"Japanese Yen",
    KES:	"Kenyan Shilling",
    KGS:	"Kyrgystani Som",
    KHR:	"Cambodian Riel",
    KMF:	"Comorian Franc",
    KPW:	"North Korean Won",
    KRW:	"South Korean Won",
    KWD:	"Kuwaiti Dinar",
    KYD:	"Cayman Islands Dollar",
    KZT:	"Kazakhstani Tenge",
    LAK:	"Laotian Kip",
    LBP:	"Lebanese Pound",
    LKR:	"Sri Lankan Rupee",
    LRD:	"Liberian Dollar",
    LSL:	"Lesotho Loti",
    LTL:	"Lithuanian Litas",
    LVL:	"Latvian Lats",
    LYD:	"Libyan Dinar",
    MAD:	"Moroccan Dirham",
    MDL:	"Moldovan Leu",
    MGA:	"Malagasy Ariary",
    MKD:	"Macedonian Denar",
    MMK:	"Myanma Kyat",
    MNT:	"Mongolian Tugrik",
    MOP:	"Macanese Pataca",
    MRO:	"Mauritanian Ouguiya",
    MUR:	"Mauritian Rupee",
    MVR:	"Maldivian Rufiyaa",
    MWK:	"Malawian Kwacha",
    MXN:	"Mexican Peso",
    MYR:	"Malaysian Ringgit",
    MZN:	"Mozambican Metical",
    NAD:	"Namibian Dollar",
    NGN:	"Nigerian Naira",
    NIO:	"Nicaraguan Córdoba",
    NOK:	"Norwegian Krone",
    NPR:	"Nepalese Rupee",
    NZD:	"New Zealand Dollar",
    OMR:	"Omani Rial",
    PAB:	"Panamanian Balboa",
    PEN:	"Peruvian Nuevo Sol",
    PGK:	"Papua New Guinean Kina",
    PHP:	"Philippine Peso",
    PKR:	"Pakistani Rupee",
    PLN:	"Polish Zloty",
    PYG:	"Paraguayan Guarani",
    QAR:	"Qatari Rial",
    RON:	"Romanian Leu",
    RSD:	"Serbian Dinar",
    RUB:	"Russian Ruble",
    RWF:	"Rwandan Franc",
    SAR:	"Saudi Riyal",
    SBD:	"Solomon Islands Dollar",
    SCR:	"Seychellois Rupee",
    SDG:	"Sudanese Pound",
    SEK:	"Swedish Krona",
    SGD:	"Singapore Dollar",
    SHP:	"Saint Helena Pound",
    SLL:	"Sierra Leonean Leone",
    SOS:	"Somali Shilling",
    SRD:	"Surinamese Dollar",
    STD:	"São Tomé and Príncipe Dobra",
    SVC:	"Salvadoran Colón",
    SYP:	"Syrian Pound",
    SZL:	"Swazi Lilangeni",
    THB:	"Thai Baht",
    TJS:	"Tajikistani Somoni",
    TMT:	"Turkmenistani Manat",
    TND:	"Tunisian Dinar",
    TOP:	"Tongan Paʻanga",
    TRY:	"Turkish Lira",
    TTD:	"Trinidad and Tobago Dollar",
    TWD:	"New Taiwan Dollar",
    TZS:	"Tanzanian Shilling",
    UAH:	"Ukrainian Hryvnia",
    UGX:	"Ugandan Shilling",
    USD:	"United States Dollar",
    UYU:	"Uruguayan Peso",
    UZS:	"Uzbekistan Som",
    VEF:	"Venezuelan Bolívar Fuerte",
    VND:	"Vietnamese Dong",
    VUV:	"Vanuatu Vatu",
    WST:	"Samoan Tala",
    XAF:	"CFA Franc BEAC",
    XAG:	"Silver (troy ounce)",
    XAU:	"Gold (troy ounce)",
    XCD:	"East Caribbean Dollar",
    XDR:	"Special Drawing Rights",
    XOF:	"CFA Franc BCEAO",
    XPF:	"CFP Franc",
    YER:	"Yemeni Rial",
    ZAR:	"South African Rand",
    ZMK:	"Zambian Kwacha (pre-2013)",
    ZMW:	"Zambian Kwacha",
    ZWL:	"Zimbabwean Dollar"
  };
}

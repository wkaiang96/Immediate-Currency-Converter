var user_base = '';
var user_convert = '';
var advance = false;
var convertCurrency= [];

document.addEventListener("click", function(e) {
  console.log('click');
  let base_curr = {
    name: "USD"
  };

  let convert_curr = {
    name: "MYR"
  }

  function getCurrentbrowser() {
    return browser.browsers.getCurrent();
  }

  function uncheckLastBaseSelection(item){
    const btns = document.querySelectorAll('button.btn-mini');

    for (const b of btns) {
      if (b.id.indexOf('b_') > -1) {
        b.classList.remove('btn-positive');
        b.classList.add('btn-default');
      }
    }
  }

  function checkNewBaseSelection(selection){
    var new_selection = "b_" + selection.name;
    var base_selection = document.getElementById(new_selection);
    base_selection.classList.remove('btn-default');
    base_selection.classList.add('btn-positive');

    let result = browser.storage.local.set({base_curr});
    result.then(function() {
      document.getElementById('base_curr').innerText = base_curr.name;
    }, onError);
  }

  function uncheckLastConvertSelection(item){
    const btns = document.querySelectorAll('button.btn-mini');

    for (const b of btns) {
      if (b.id.indexOf('c_') > -1) {
        b.classList.remove('btn-positive');
        b.classList.add('btn-default');
      }
    }
  }

  function checkNewConvertSelection(selection){
    var new_selection = "c_" + selection.name;    
    var base_selection = document.getElementById(new_selection);
    base_selection.classList.remove('btn-default');
    base_selection.classList.add('btn-positive');

    let result = browser.storage.local.set({convert_curr});
    result.then(function() {
      document.getElementById('convert_curr').innerText = convert_curr.name;
    }, onError);
  }

  if (e.target.id === "browser-update-minimize") {
    getCurrentbrowser().then((currentbrowser) => {
      var updateInfo = {
        state: "minimized"
      };

      browser.browsers.update(currentbrowser.id, updateInfo);
    });
  }
  else if(e.target.id.startsWith("b_")){
    uncheckLastBaseSelection(user_base);
    // extract the part of the id after "b_"
    base_curr.name = e.target.id.slice(2);
    // console.log('base curr selected', base_curr);
    checkNewBaseSelection(base_curr);
    makeTitle();
  }
  else if(e.target.id.startsWith("c_")) {
    uncheckLastConvertSelection(user_convert);
    // extract the part of the id after "c_"
    convert_curr.name = e.target.id.slice(2);
     //console.log('convert curr selected', convert_curr);
    if (convertCurrency.includes("c_"+convert_curr.name)){
      var num = convertCurrency.indexOf("c_"+convert_curr.name);
      convertCurrency.splice(num, 1);
      console.log(convertCurrency);
    }
    else if (!convertCurrency.includes("c_"+convert_curr.name)){
      convertCurrency.push("c_"+convert_curr.name);
      console.log(convertCurrency);
    }
    checkNewConvertSelection(convert_curr);
    makeTitle();
  } 
  else if (e.target.id == 'advanceChk') {
    if (e.target.checked) {
      setAdvanceIndicator(true);
      advanceView();
    } else {
      setAdvanceIndicator(false);
      defaultView();
    }
  }
  else if (e.target.id === 'binfo') {
    console.log('guide');
    const guide = document.getElementById('guide');
    const panel = document.getElementById('panel');
    const check_box = document.getElementById('checkbox_label');
    if (guide.style.display === 'none') {
      guide.style.display = 'block';
      panel.style.display = 'none';
      check_box.style.display = 'none';
    } else {
      guide.style.display = 'none';
      panel.style.display = 'block';
      check_box.style.display = 'inline-block';
    }
  }
});

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
      title = "Convert from " + user_base + " to " + user_convert;
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

const b_filterCurrencies = function() {
  var bin_search = document.getElementById('bin_search');
  const fullCurrencies = getfullCurrencies();
  const currencies = {};
  const search_val = bin_search.value;
  if (search_val && search_val.length > 0) {
  Object.keys(fullCurrencies).forEach(function(currency) {
      if (currency.indexOf(search_val.toUpperCase()) > -1) {
        currencies[currency] = fullCurrencies[currency];
      }
    });
    removeFullCurrencies(true);
    console.log('gen currency ', currencies); 
    generateCurrenciesBtn(currencies, true, false);
  } else {
    removeFullCurrencies(true);
    generateCurrenciesBtn(fullCurrencies, true, false);
  }
}

const c_filterCurrencies = function() {
  var cin_search = document.getElementById('cin_search');
  const fullCurrencies = getfullCurrencies();
  const currencies = {};
  const search_val = cin_search.value;
  console.log('search val ', search_val);
  if (search_val && search_val.length > 0) {
    Object.keys(fullCurrencies).forEach(function(currency) {
      if (currency.indexOf(search_val.toUpperCase()) > -1) {
        currencies[currency] = fullCurrencies[currency];
      }
    });
    removeFullCurrencies(false, true);
    console.log('gen currency ', currencies);
    generateCurrenciesBtn(currencies, false, true);
  } else {
    removeFullCurrencies(false, true);
    generateCurrenciesBtn(fullCurrencies, false, true);
  }
}

browser.storage.local.get().then(function(item) {
  if (! isEmpty(item)) {
    if (item.base_curr.name) {
      document.getElementById('base_curr').innerText = item.base_curr.name;
    }
    if (item.convert_curr.name) {
      document.getElementById('convert_curr').innerText = item.convert_curr.name;
    }
    if (item.advance !== null  || item.advance !== undefined) {
      advance = item.advance;
      console.log('advance trigger ', advance);
      if (advance) {
        advanceView();
        document.getElementById('advanceChk').checked = true;
        
      } else {
        defaultView();
      }
    } else {
      defaultView();
    }
  }
}, function(err) {
  console.error(err);
});

function setAdvanceIndicator(val) {
  browser.storage.local.set({advance: val}).then(onUpdated, onError);
}

function populateFullCurrencies() {
  var availableCurrencies = getfullCurrencies()
  generateCurrenciesBtn(availableCurrencies);
}

function generateCurrenciesBtn(availableCurrencies, base = true, convert = true) {
  var basePanel = document.getElementById("advanceBase");
  var convertPanel = document.getElementById("advanceConvert");
  Object.keys(availableCurrencies).forEach(function(currency) {
    if (base) {
      var b_btn = document.createElement("button");
      b_btn.innerText = currency;
      b_btn.title = availableCurrencies[currency];
      b_btn.id = 'b_' + currency;
      b_btn.classList.add('btn-mini');
      b_btn.classList.add('btn-default');
      basePanel.append(b_btn);
    }
     
    if (convert) {
      var c_btn = document.createElement("button");
      c_btn.innerText = currency;
      c_btn.title = availableCurrencies[currency];
      c_btn.id = 'c_' + currency;
      c_btn.classList.add('btn-mini');
      c_btn.classList.add('btn-default');
      convertPanel.append(c_btn);
    }
  });
}

function removeFullCurrencies(base, convert) {
  var basePanel = document.getElementById("advanceBase");
  var convertPanel = document.getElementById("advanceConvert");
  if (base) {
    basePanel.innerHTML = '';
  }
  if (convert) {
    convertPanel.innerHTML = '';
  }
}

function advanceView() {
  document.getElementById('defaultBase').style.display = 'none';
  document.getElementById('defaultConvert').style.display = 'none';
  document.getElementById('advanceBase').style.display = 'block';
  document.getElementById('advanceBase').style.marginBottom = '10px';
  document.getElementById('advanceConvert').style.display = 'block';
  document.getElementById('advanceConvert').style.marginBottom = '10px';
  populateFullCurrencies();
  document.getElementById('panel').style.height = '420px';
  document.getElementById('panel').style.width = '540px';
  document.getElementById('panel').style.display = 'flex';
  document.getElementById('panel-section-base').style.display = "inline-block";
  document.getElementById('panel-section-convert').style.display = "inline-block";
  var bin_search = document.getElementById('bin_search');
  var cin_search = document.getElementById('cin_search');
  bin_search.style.display = 'block';
  cin_search.style.display = 'block';
  bin_search.focus();
  bin_search.onkeydown = b_filterCurrencies;
  bin_search.onkeypress = b_filterCurrencies;
  bin_search.onkeyup = b_filterCurrencies;
  cin_search.onkeydown = c_filterCurrencies;
  cin_search.onkeypress = c_filterCurrencies;
  cin_search.onkeyup = c_filterCurrencies;
}

function defaultView() {
  document.getElementById('defaultBase').style.display = 'block';
  document.getElementById('defaultConvert').style.display = 'block';
  document.getElementById('bin_search').style.display = 'none';
  document.getElementById('cin_search').style.display = 'none';
  removeFullCurrencies(true, true);
  document.getElementById('advanceBase').style.display = 'none';
  document.getElementById('advanceConvert').style.display = 'none';
  document.getElementById('panel').style.height = '420px';
  document.getElementById('panel').style.width = '280px';
  document.getElementById('panel').style.display = 'unset';
  document.getElementById('panel-section-base').style.display = "block";
  document.getElementById('panel-section-convert').style.display = "block";
}

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

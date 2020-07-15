## Guide for users of Immediate Currency Converter

When you first install this extension, it will require you to choose the default currency to do the conversion. Please click on the toolbar button and set your default base currency (to convert from) and your target currency (to convert to). Without this initialization, the conversion will not work.

After choosing the currency, you can highlight any number on the web page and right click the amount to do the conversion.

If the highlighted text contains a currency symbol or abbreviation (eg: "99 AUD", "₹ 1234", etc.), then that currency is used as the base currency for this conversion. If no such currency indicator is present, then the default base currency set initially is used. 

You can change the base and target currencies at any time by clicking the toolbar button again.

## For Contributors

This plugin required jquery to work. The jquery version I'm using is 3.2.1 (non-minified version).

The jquery file has been included in the extension, in case you would to reproduce it, copy the whole jquery-3.2.1 and make a new file again.

~~The currency rate that I'm getting is from https://www.fixer.io. Visit their site to know about it.~~

The currency rate is provider by European Central Bank (https://www.ecb.europa.eu), due to CORS issue, I've self host a server to retrieve the rates through that. You can check on my other project, https://github.com/YJChan/RatesConverter, endpoint is (http://immcurr.appec.work/v1/exchgrate).

Future planning
-----------------
one application that store historical currency rate and live rates? Hmm... still considering this.

## Changelog

### Update 0.1
* Added support for EUR currencies

### Update 0.2
* User hover to see currency's country / locate.
* Able to highlight and convert amount with comma ','. Example: 1,000,000.00 is accepted.

### Update 0.3 
* Allow selecting the currency along with the text, to use that currency as base currency for this conversion. Eg. selecting "€ 42" will convert 42 Euros into user's target currency.    
* Allow numbers in European/alternative format, for eg., 1.000.000,00 is accepted and treated as 1 million. (Note however that this happens only when there are at least two dots in the number. 25.000 is treated as 25, not as 25000.)


### Update 0.4
* Allow users to select multiple Convert Currency, then it will display the converion at pop-up
* When users select multiple Convert Currency then those selected currency's buttons will be highlighted 

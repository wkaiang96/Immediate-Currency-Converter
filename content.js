import { Conversion }  from 'conversion.js';
console.log('imm registered');
const pattern = new RegExp(/['"]?(\d+(\.\d+)?)['"]?/);
var current_conversion;
var dailyDataArray;
var symbol_currency_map;
var dataHeader = "imm_";
var dataKey;


window.document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection().getRangeAt(0).toString();
  if (selection.length > 0) {
    const regexMatch = selection.match(pattern);
    if (regexMatch) {
      current_conversion = new Conversion(selection);
      current_conversion.start_conversion();
    }
  }
});

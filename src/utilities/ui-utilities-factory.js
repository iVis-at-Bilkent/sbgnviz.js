/*
* Commonly needed UI Utilities
*/

var libUtilities = require('./lib-utilities');
var libs = libUtilities.getLibs();
var jQuery = $ = libs.jQuery;

module.exports = function () {

 var optionUtilities;
 var options;

 function uiUtilities (param) {
   optionUtilities = param.optionUtilities;
   options = optionUtilities.getOptions();
 }

 uiUtilities.startSpinner = function (className) {
   if (!className) {
     className = 'default-class';
   }

   if ($('.' + className).length === 0) {
     var containerWidth = $(options.networkContainerSelector).width();
     var containerHeight = $(options.networkContainerSelector).height();
     $(options.networkContainerSelector + ':parent').prepend('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw ' + className + '"></i>');
   }
 };

 uiUtilities.endSpinner = function (className) {
   if (!className) {
     className = 'default-class';
   }

   if ($('.' + className).length > 0) {
     $('.' + className).remove();
   }
 };


 uiUtilities.showSpinnerText = function (className) {
  if (!className) {
    className = 'default-class';
  }
  if ($('.' + className).length === 0) {
    var containerWidth = $(options.networkContainerSelector).width();
    var containerHeight = $(options.networkContainerSelector).height();
    $(options.networkContainerSelector + ':parent').append('<i style=" position: absolute; z-index: 9999999; left: ' + 4*containerWidth / 9 + 'px; top: ' +  4* containerHeight/7 + 'px;" class="' + className + '">Take a sip of your coffee while you wait</i>');
    $("."+className).hide(0)
    $("."+className).delay(10000).show(0)
 
  }
};
uiUtilities.removeSpinnerText = function (className) {
  if (!className) {
    className = 'default-class';
  }
console.log('className removeSpinnerText', className)
  if ($('.' + className).length > 0) {
    $('.' + className).remove();
  }
};
 return uiUtilities;
};

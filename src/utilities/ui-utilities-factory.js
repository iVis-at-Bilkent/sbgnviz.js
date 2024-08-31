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
    $(options.networkContainerSelector + ':parent').prepend('<div style="position: absolute; z-index: 9999999; left: 45%; top: ' + containerHeight / 2 + 'px;" class="'+className+'-wrapper">'+
    '<div style="margin: 0 auto; margin-bottom: 5px; width:50px"><i class="fa fa-spinner fa-spin fa-3x fa-fw ' + className + '"></i></div>'+
    '<div style="width: 220px; height 20%"><i class="' + className + '-text">Take a sip of your coffee while you wait...</i></div>'+
    '</div>');
    $("."+className+'-text').fadeOut(0)
   }
 };
 uiUtilities.showSpinnerText = function(className)
 {
   $("."+className+'-text').fadeIn(0)
 }

 uiUtilities.endSpinner = function (className) {
   if (!className) {
     className = 'default-class';
   }

   if ($('.' + className + '-wrapper').length > 0) {
    $('.' + className + '-wrapper').remove();
  }
 };


 return uiUtilities;
};

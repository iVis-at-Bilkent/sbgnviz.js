function tdParser() {
};

tdParser.getTabsArray = function( line ) {
  return line.split( '\t' );
};

tdParser.getLinesArray = function( content ) {
  var separator = /\r?\n|\r/;
  return content.split( separator );
};

module.exports = tdParser;

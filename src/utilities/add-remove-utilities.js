var addRemoveUtilities = {
  restoreEles: function (eles) {
    eles.restore();
    return eles;
  },
  removeElesSimply: function (eles) {
    return eles.remove();
  }
};
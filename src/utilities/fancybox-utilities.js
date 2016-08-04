var fancyboxUtilities = {
  openFancybox: function($template, options) {
    $.fancybox(
            _.template($template.html(), {}),
            $.extend( {}, {
              'autoDimensions': true,
              'transitionIn': 'none',
              'transitionOut': 'none',
              'onStart': function() { 
                var zoomFcn, panFcn;
                cy.ready(function () {
                  cy.on('zoom', zoomFcn = function () {
                    $template.data('zoomFcn', zoomFcn);
                    $.fancybox.close();
                  });

                  cy.on('pan', panFcn = function () {
                    $template.data('panFcn', panFcn);
                    $.fancybox.close();
                  });
                });
              },
              'onClosed': function() { 
                cy.ready(function () {
                  if ($template.data('zoomFcn')) {
                    cy.off('zoom', $template.data('zoomFcn'));
                  }

                  if ($template.data('panFcn')) {
                    cy.off('pan', $template.data('panFcn'));
                  }
                });
              }
            }, options) );
  }
};
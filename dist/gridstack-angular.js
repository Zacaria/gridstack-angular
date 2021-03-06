(function() {
  'use strict';

  angular.module('gridstack-angular', []);

  var app = angular.module('gridstack-angular');

  /** @ngInject */
  app.controller('GridstackController', ['$scope', function($scope) {

    var gridstack = null;

    this.init = function(element, options) {
      gridstack = element.gridstack(options).data('gridstack');
      return gridstack;
    };

    this.removeItem = function(element) {
      if(gridstack) {
        return gridstack.removeWidget(element, false);
      }
      return null;
    };

    this.addItem = function(element) {
      if(gridstack) {
        gridstack.makeWidget(element);
        return element;
      }
      return null;
    };

  }]);
})();

(function() {
  'use strict';

  var app = angular.module('gridstack-angular');

  /** @ngInject */
  app.directive('gridstack', ['$timeout', function($timeout) {

    return {
      restrict: "A",
      controller: 'GridstackController',
      scope: {
        onChange: '&',
        onDragStart: '&',
        onDragStop: '&',
        onResizeStart: '&',
        onResizeStop: '&',
        gridstackHandler: '=',
        options: '='
      },
      link: function (scope, element, attrs, controller, ngModel) {

        var gridstack = controller.init(element, scope.options);
        scope.gridstackHandler = gridstack;

        element.on('change', function (e, items) {
          $timeout(function() {
            scope.$apply();
            scope.onChange({event: e, items: items});
          });
        });

        element.on('dragstart', function(e, ui) {
          scope.onDragStart({event: e, ui: ui});
        });

        element.on('dragstop', function(e, ui) {
          $timeout(function() {
            scope.$apply();
            scope.onDragStop({event: e, ui: ui});
          });
        });

        element.on('resizestart', function(e, ui) {
          scope.onResizeStart({event: e, ui: ui});
        });

        element.on('resizestop', function(e, ui) {
          $timeout(function() {
            scope.$apply();
            scope.onResizeStop({event: e, ui: ui});
          });
        });

      }
    };

  }]);
})();

(function() {
    'use strict';

    var app = angular.module('gridstack-angular');

    /** @ngInject */
    app.directive('gridstackItem', ['$timeout', function($timeout) {

        return {
            restrict: "A",
            controller: 'GridstackController',
            require: '^gridstack',
            scope: {
                gridstackItem: '=',
                onItemAdded: '&',
                onItemRemoved: '&',
                gsItemX: '=',
                gsItemY: '=',
                gsItemWidth: '=',
                gsItemHeight: '=',
                gsItemMinWidth: '=',
                gsItemMinHeight: '=',
                gsItemMaxWidth: '=',
                gsItemMaxHeight: '=',
                gsItemAutopos: '='
            },
            link: function(scope, element, attrs, controller) {

                $(element).attr('data-gs-x', scope.gsItemX);
                $(element).attr('data-gs-y', scope.gsItemY);
                $(element).attr('data-gs-width', scope.gsItemWidth);
                $(element).attr('data-gs-height', scope.gsItemHeight);
                $(element).attr('data-gs-min-width', scope.gsItemMinWidth);
                $(element).attr('data-gs-min-height', scope.gsItemMinHeight);
                $(element).attr('data-gs-max-width', scope.gsItemMaxWidth);
                $(element).attr('data-gs-max-height', scope.gsItemMaxHeight);
                $(element).attr('data-gs-auto-position', scope.gsItemAutopos);
                var widget = controller.addItem(element);
                var item = element.data('_gridstack_node');
                $timeout(function() {
                    scope.onItemAdded({ item: item });
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-x');
                }, function(val) {
                    scope.gsItemX = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-y');
                }, function(val) {
                    scope.gsItemY = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-width');
                }, function(val) {
                    scope.gsItemWidth = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-height');
                }, function(val) {
                    scope.gsItemHeight = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-min-width');
                }, function(val) {
                    scope.gsItemMinWidth = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-min-height');
                }, function(val) {
                    scope.gsItemMinHeight = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-max-width');
                }, function(val) {
                    scope.gsItemMaxWidth = val;
                });

                scope.$watch(function() {
                    return $(element).attr('data-gs-max-height');
                }, function(val) {
                    scope.gsItemMaxHeight = val;
                });

                element.bind('$destroy', function() {
                    var item = element.data('_gridstack_node');
                    scope.onItemRemoved({ item: item });
                    controller.removeItem(element);
                });

            }

        };

  }]);
})();

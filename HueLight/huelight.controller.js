(function () {
    'use strict';
    angular
        .module('app.widgets.hue', [])
        .controller('ngHueCtrl', ['$rootScope', '$scope', 'OHService',
            function ($rootScope, $scope, OHService) {
                var vm = this;

                vm.widget = {
                    backdrop_icon: $scope.config.backdrop_icon,
                    backdrop_icon_iconset: $scope.config.backdrop_icon_iconset,
                    backdrop_center: $scope.config.backdrop_center,


                    onoff_icon: $scope.config.onoff_icon,
                    onoff_icon_iconset: $scope.config.onoff_icon_iconset,

                    title: $scope.config.title,
                    hideTitle: $scope.config.hideTitle,
                    type: $scope.config.type,
                    temperature: $scope.config.temperature,
                    color: $scope.config.color
                }

                vm.dimmerSliderModel = {
                    name: "Brightness", 
                    item: vm.widget.temperature, 
                    floor: 0, 
                    ceil: 100, 
                    step: 1, 
                    hidelabel: false, 
                    hidelimits: true 
                }

                vm.lightnessSlider = {
                    value: 0,
                    options: {
                        floor: 0,
                        ceil: 100,
                        step: 1,
                        hideLimitLabels: true,
                        onEnd: lightnessSliderChangeListener
                    }
                }

                vm.lightOff = true;
                vm.toggleBulb = toggleBulb;

                vm.widget.onoff_icon = !$scope.config.onoff_icon ? "power-button" : $scope.config.onoff_icon;
                vm.widget.onoff_icon_iconset = !$scope.config.onoff_icon_iconset ? "smarthome-set" : $scope.config.onoff_icon_iconset;

                function loadBulbStatus() {
                    console.log("Processing Bulb status");
                    try {
                        var lightness = $scope.itemState(vm.widget.color).split(',')[2];

                        vm.lightnessSlider.value = lightness
                        vm.lightOff = lightness === '0';

                    } catch (err) {
                        console.log("Error during Hue widget: " + err)
                    }
                }

                function toggleBulb() {
                    console.log("Toggling Bulb");

                    vm.lightOff = !vm.lightOff;

                    var hue = $scope.itemState(vm.widget.color).split(',')[0];
                    var saturation = $scope.itemState(vm.widget.color).split(',')[1];
                    var lightness = vm.lightOff ? '0' : '100';

                    var hslValue = hue + ',' + saturation + ',' + lightness;

                    $scope.sendCmd(vm.widget.color, hslValue);
                }

                function lightnessSliderChangeListener() {
                    var hue = $scope.itemState(vm.widget.color).split(',')[0];
                    var saturation = $scope.itemState(vm.widget.color).split(',')[1];
                    var lightness = vm.lightnessSlider.value;

                    var hslValue = hue + ',' + saturation + ',' + lightness;

                    $scope.sendCmd(vm.widget.color, hslValue);


                    console.log('New HSL value', hslValue);
                }

                // Run function when an items updates
                $rootScope.$on('openhab-update', function (event, item) {
                    loadBulbStatus();
                });

                loadBulbStatus();
            }
        ]);
})();
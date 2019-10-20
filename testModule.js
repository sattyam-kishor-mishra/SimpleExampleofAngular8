/// <reference path="../Angular/angular.min.js" />

// 'uiSlider',
var myApp = angular.module("mainApp", ['rzModule', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'ngRoute', 'angularUtils.directives.dirPagination', 'thatisuday.ng-image-gallery'])
    .directive('hotelautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" style="padding-left: 34px;" type="text" onfocus="this.select();" class="input-text form-control alignRight" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches"   uib-tooltip="{{option[displayProperty]}} ">' +
                       "<span><span ng-if='option[iconType] == cityType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='soap-icon-hotel-2'></i></span> <span ng-if='option[iconType] == locationType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-map-marker' aria-hidden='true'></i></span> <span ng-if='option[iconType] == hotelType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-bed' aria-hidden='true'></i></span> {{option[displayProperty] | limitTo : 45 }}{{option[displayProperty].length > 45 ? '...' : ''}}</span>" +
                    '</li>' +
                '</ul>' +
                '</div></div>' +
                '</div>' +
                '</div>',
            //'<span ng-if="selectedOption.Type == cityType" style="position: absolute;left: 16px;top: 71px;"><i class="soap-icon-hotel-2"></i></span> <span ng-if="selectedOption.Type == locationType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-map-marker" aria-hidden="true"></i></span> <span ng-if="selectedOption.Type == hotelType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-bed" aria-hidden="true"></i></span>',

            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '=',
                iconType: '@'
            },
            controller: function ($scope, HotelFactory) {



                //            minStartDate = scope.$parent.getMinDate(scope.dateType);
                //            if (scope.dateType.toUpperCase() == "CHKIN")
                //                minStartDate.setDate(minStartDate.getDate() + 3);
                //            maxEndDate = new Date(minStartDate); //Date.parse(minStartDate);//
                //            maxEndDate.setDate(maxEndDate.getDate() + 365)

                //$scope.messagesForm.dateFrom = moment().subtract('days', 30).format('MM/DD/YYYY');
                //$scope.messagesForm.dateTo = moment().format('MM/DD/YYYY');
                //$scope.$watch('messagesForm.dateTo', function (newVal, oldVal) {
                //    if (!newVal) return;
                //    if (Date.parse(newVal) < Date.parse($scope.messagesForm.dateFrom)) {
                //        $scope.messagesForm.dateFrom = newVal;
                //    }
                //});


                //scope.$apply(function (scope) {
                //    minStartDate = scope.$parent.getMinDate(scope.dateType);
                //    if (scope.dateType.toUpperCase() == "CHKIN")
                //        minStartDate.setDate(minStartDate.getDate() + 3);
                //    maxEndDate = new Date(minStartDate); //Date.parse(minStartDate);//
                //    maxEndDate.setDate(maxEndDate.getDate() + 365)
                //});


                //var month = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };
                //var getProperty = function (propertyName) {
                //    return month[propertyName];
                //};

                //var dateArray = scope.ngModel.split(' ');
                //if (dateArray.length <= 1) { dateArray = scope.ngModel.split('-') }

                //var minStartDate;
                //var maxEndDate;
                ////var defaultDate = new Date(dateArray[2] + '-' + getProperty(dateArray[1]) + '-' + dateArray[0]);


                //scope.$apply(function (scope) {
                //    minStartDate = scope.$parent.getMinDate(scope.dateType);
                //    if (scope.dateType.toUpperCase() == "CHKIN")
                //        minStartDate.setDate(minStartDate.getDate() + 3);
                //    maxEndDate = new Date(minStartDate); //Date.parse(minStartDate);//
                //    maxEndDate.setDate(maxEndDate.getDate() + 365)
                //});



                //$scope.minStartDate = moment().subtract('days', 30).format('MM/DD/YYYY');
                //$scope.maxEndDate = moment().format('MM/DD/YYYY')
                //$scope.maxEndDate
                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.cityType = "City";
                $scope.locationType = "Location";
                $scope.hotelType = "Hotel";

                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    $scope.SearchTxt = term;
                    $scope.showOptions = true;
                    $scope.CityLoader = true;
                    if (term.length > 2) {
                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }
                        HotelFactory.CityList(term).then(function (response) {
                            $scope.matchingOptions = response.CityResponse.Destinations.DestinationItems;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }

                            $scope.showOptions = true;
                            if ($scope.matchingOptions.length == 0) {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                            }
                            else {
                                $scope.CityLoader = false;
                                $scope.hasMatches = false;
                            }

                        });

                        //HotelFactory.CityList(term).then(function (response) {
                        //    $scope.matchingOptions = response.CityResponse.Details.City;
                        //    if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                        //        $scope.clearHighlight();
                        //    }
                        //    $scope.hasMatches = $scope.matchingOptions.length > 0;
                        //    $scope.showOptions = true;
                        //});
                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();
                    }
                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();
                    }
                    else {
                        if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                            switch (e.which) {
                                case Keys.upArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightPrevious();
                                    }
                                    break;
                                case Keys.downArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightNext();
                                    } else {
                                        $scope.showOptions = true;
                                        if ($scope.selectedOption) {
                                            $scope.highlightedOption = $scope.selectedOption;
                                        }
                                    }
                                    break;
                                case Keys.enter:
                                    e.preventDefault();
                                    if ($scope.highlightedOption) {
                                        $scope.selectOption($scope.highlightedOption);
                                    } else {
                                        var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                        if (exactMatches[0]) {
                                            $scope.selectOption(exactMatches[0]);
                                        }
                                    }
                                    break;
                                case Keys.escape:
                                    $scope.closeAndClear();
                                    break;
                                case Keys.del:
                                    $scope.clearSelectedSearch();
                                case Keys.backspace:
                                    if ($scope.ngModel != '')
                                        $scope.clearSelectedSearch();
                                    break;
                            }
                        }
                        else if (e.which >= 65 && e.which <= 90) {
                            if ($scope.ngModel != '')
                                $scope.clearSelectedSearch();
                        }
                    }

                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;  // hotel show/hide auto generate
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {

                //scope.render = function () {
                //    scope.$emit('searchTerm');
                //};
                //scope.render();

                //scope.$watch('searchTerm', function (newValue, oldValue) {
                //    if (!newValue || angular.equals(newValue, oldValue))
                //        return;
                //    scope.render();
                //})

                scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                scope.setOptionWidth = function () {
                    // console.log(inputElement.offsetWidth);
                    $timeout(function () {
                        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                        scope.optionWidth = pixelWidth + 'px';
                    });
                };

                angular.element(document).ready(function () {
                    scope.setOptionWidth();
                });

                angular.element($window).bind('resize', function () {
                    scope.setOptionWidth();
                });
            }
        };
    }])
    .directive('activityautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" style="padding-left:34px;" type="text" onfocus="this.select();" class="input-text form-control" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width">' +
                    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches">' +
                        '<span><i class="soap-icon-hotel-2" style="font-size: 17px;vertical-align:baseline !important"></i> {{option[displayProperty]}}</span>' +
                    '</li>' +
                '</ul>' +
                '</div>' +
                '</div>',

            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '='
            },
            controller: function ($scope, ActivityFactory) {
                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;

                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    $scope.CityLoader = true;
                    if (term.length > 2) {
                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }

                        ActivityFactory.CityList(term).then(function (response) {
                            $scope.matchingOptions = response.CityResponse.Details.City;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }

                            $scope.showOptions = true;
                            if ($scope.matchingOptions.length == 0) {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                            }
                            else {
                                $scope.CityLoader = false;
                                $scope.hasMatches = false;
                            }

                        });

                        //ActivityFactory.CityList(term).then(function (response) {
                        //    $scope.matchingOptions = response.CityResponse.Details.City;
                        //    if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                        //        $scope.clearHighlight();
                        //    }
                        //    $scope.hasMatches = $scope.matchingOptions.length > 0;
                        //    $scope.showOptions = true;
                        //});
                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();
                    }
                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();
                    }
                    else {
                        if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                            switch (e.which) {
                                case Keys.upArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightPrevious();
                                    }
                                    break;
                                case Keys.downArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightNext();
                                    } else {
                                        $scope.showOptions = true;
                                        if ($scope.selectedOption) {
                                            $scope.highlightedOption = $scope.selectedOption;
                                        }
                                    }
                                    break;
                                case Keys.enter:
                                    e.preventDefault();
                                    if ($scope.highlightedOption) {
                                        $scope.selectOption($scope.highlightedOption);
                                    } else {
                                        var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                        if (exactMatches[0]) {
                                            $scope.selectOption(exactMatches[0]);
                                        }
                                    }
                                    break;
                                case Keys.escape:
                                    $scope.closeAndClear();
                                    break;
                                case Keys.del:
                                    $scope.clearSelectedSearch();
                                case Keys.backspace:
                                    if ($scope.ngModel != '')
                                        $scope.clearSelectedSearch();
                                    break;
                            }
                        }
                        else if (e.which >= 65 && e.which <= 90) {
                            if ($scope.ngModel != '')
                                $scope.clearSelectedSearch();
                        }
                    }
                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {
                scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                scope.setOptionWidth = function () {
                    // console.log(inputElement.offsetWidth);
                    $timeout(function () {
                        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                        scope.optionWidth = pixelWidth + 'px';
                    });
                };

                angular.element(document).ready(function () {
                    scope.setOptionWidth();
                });

                angular.element($window).bind('resize', function () {
                    scope.setOptionWidth();
                });
            }
        };
    }])
    .directive('flightautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" onfocus="this.select();" type="text" id="txt{{cityType}}{{searchCount}}" class="autocomplete-input alignRight" placeholder="{{placeHolder}}"' +
                'ng-class="inputClass"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="autocomplete-option" ng-if="!hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches">' +
                    //"{{matchingOptions.length}}" +
                       "<span ng-if='option[iconType] == TypeCity'><span class='ARRCityIcon'><i class='soap-icon-hotel-2'></i></span> {{option[displayProperty]}}</span>" +
                       "<span ng-if='option[iconType] != TypeCity && option.airportcode != option.citycode && matchingOptions.length>1'><span class='ARRCityIcon'><img src='Images/TCO/pointer.svg' style='width: 12px; vertical-align: middle; margin-right: 5px; margin-left: 10px;background: transparent!important;'/></span> {{option[displayProperty]}}</span>" +
                       "<span ng-if='option[iconType] != TypeCity && option.airportcode != option.citycode && matchingOptions.length==1 && cityType == ARRCity'><span class='ARRCityIcon'><i class='fa fa-plane landing-effect'></i></span> {{option[displayProperty]}}</span>" +
                       "<span ng-if='option[iconType] != TypeCity && option.airportcode != option.citycode && matchingOptions.length==1 && cityType == DEPCity'><span class='ARRCityIcon'><i class='fa fa-plane takeoff-effect'></i></span> {{option[displayProperty]}}</span>" +
                       "<span ng-if='option[iconType] == TypeAirport && option.airportcode == option.citycode && cityType == ARRCity'><span class='ARRCityIcon'><i class='fa fa-plane landing-effect'></i></span> {{option[displayProperty]}}</span>" +
                       "<span ng-if='option[iconType] == TypeAirport && option.airportcode == option.citycode && cityType == DEPCity'><span class='ARRCityIcon'><i class='fa fa-plane takeoff-effect'></i></span> {{option[displayProperty]}}</span>" +
                       //"<span ng-if='cityType == DEPCity'><span class='DEPCityIcon'><i class='fa fa-plane takeoff-effect' aria-hidden='true'></i></span> {{option[displayProperty]}}</span>" +
                       //"<span ng-if='cityType == ARRCity'><span class='ARRCityIcon'><i class='fa fa-plane landing-effect' aria-hidden='true'></i></span> {{option[displayProperty]}}</span>" +
                    '</li>' +
                '</ul>' +
                '</div>' +
                '</div>',

            restrict: 'E',
            scope: {
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                cityType: '@',
                searchCount: '@',
                ngModel: '=',
                iconType: '@'

            },
            controller: function ($scope, FlightFactory) {

                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.DEPCity = "DEP";
                $scope.ARRCity = "ARR";
                $scope.TypeCity = "City";
                $scope.TypeAirport = "Airport";
                //$scope.AirportType = "Airport";

                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    if (term.length > 2) {
                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }

                        FlightFactory.GetAirportList(term).then(function (response) {
                            $scope.matchingOptions = response.AirportList.Airport;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }
                            $scope.hasMatches = $scope.matchingOptions.length > 0;
                            var prevousItem = null;
                            for (var i = 1; i < $scope.matchingOptions.length; i++) {

                                if (prevousItem != null && $scope.matchingOptions[i].Citycode == prevousItem.Citycode) {
                                    $scope.matchingOptions[i].Displayname = $scope.matchingOptions[i].Displayname;

                                }
                                prevousItem = $scope.matchingOptions[i];
                            }
                            $scope.showOptions = true;
                        });
                    } else {
                        $scope.closeAndClear();
                    }
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();
                    }
                    else {
                        if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                            switch (e.which) {
                                case Keys.upArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightPrevious();
                                    }
                                    break;
                                case Keys.downArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightNext();
                                    } else {
                                        $scope.showOptions = true;
                                        if ($scope.selectedOption) {
                                            $scope.highlightedOption = $scope.selectedOption;
                                        }
                                    }
                                    break;
                                case Keys.enter:
                                    e.preventDefault();
                                    if ($scope.highlightedOption) {
                                        $scope.selectOption($scope.highlightedOption);
                                    } else {
                                        var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                        if (exactMatches[0]) {
                                            $scope.selectOption(exactMatches[0]);
                                        }
                                    }
                                    break;
                                case Keys.escape:
                                    $scope.closeAndClear();
                                    break;
                                case Keys.del:
                                    $scope.clearSelectedSearch();
                                case Keys.backspace:
                                    if ($scope.ngModel != '')
                                        $scope.clearSelectedSearch();
                                    break;
                            }
                        }
                        else if (e.which >= 65 && e.which <= 90) {
                            if ($scope.ngModel != '')
                                $scope.clearSelectedSearch();
                        }
                    }
                };

                $scope.$watch('searchTerm', function (term) {

                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;  // flight show/hide auto generate
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option, $scope.cityType, $scope.searchCount);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null, $scope.cityType, $scope.searchCount);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {

                scope.optionWidth = '800px';
                var inputElement = elem.children('.autocomplete-input')[0];

                scope.setOptionWidth = function () {
                    // console.log(inputElement.offsetWidth);
                    $timeout(function () {
                        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                        scope.optionWidth = pixelWidth + 'px';
                    });
                };

                angular.element(document).ready(function () {
                    scope.setOptionWidth();
                });

                angular.element($window).bind('resize', function () {
                    scope.setOptionWidth();
                });
            }
        };
    }])
    .directive('transferautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" style="padding-left: 34px;" type="text" onfocus="this.select();" class="input-text form-control alignRight" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches"   uib-tooltip="{{option[displayProperty]}} ">' +
                       "<span><span ng-if='option[iconType] == cityType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='soap-icon-hotel-2'></i></span> <span ng-if='option[iconType] == locationType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-map-marker' aria-hidden='true'></i></span> <span ng-if='option[iconType] == hotelType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-bed' aria-hidden='true'></i></span> {{option[displayProperty] | limitTo : 45 }}{{option[displayProperty].length > 45 ? '...' : ''}}</span>" +
                    '</li>' +
                '</ul>' +
                '</div></div>' +
                '</div>' +
                '</div>',
            //'<span ng-if="selectedOption.Type == cityType" style="position: absolute;left: 16px;top: 71px;"><i class="soap-icon-hotel-2"></i></span> <span ng-if="selectedOption.Type == locationType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-map-marker" aria-hidden="true"></i></span> <span ng-if="selectedOption.Type == hotelType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-bed" aria-hidden="true"></i></span>',

            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '=',
                iconType: '@',
                cityType: '@',
            },
            controller: function ($scope, TransferFactory) {

                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.cityType = "City";
                $scope.locationType = "Location";
                $scope.hotelType = "Hotel";

                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    $scope.SearchTxt = term;

                    $scope.showOptions = true;
                    $scope.CityLoader = true;
                    if (term.length > 2) {
                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }
                        TransferFactory.CityList(term).then(function (response) {
                            //$scope.matchingOptions = response.CityResponse.Destinations.DestinationItems
                            $scope.matchingOptions = response;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }

                            $scope.showOptions = true;
                            if ($scope.matchingOptions.length == 0) {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                            }
                            else {
                                $scope.CityLoader = false;
                                $scope.hasMatches = false;
                            }
                        });

                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();
                    }
                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                        switch (e.which) {
                            case Keys.upArrow:
                                e.preventDefault();
                                if ($scope.showOptions) {
                                    $scope.highlightPrevious();
                                }
                                break;
                            case Keys.downArrow:
                                e.preventDefault();
                                if ($scope.showOptions) {
                                    $scope.highlightNext();
                                } else {
                                    $scope.showOptions = true;
                                    if ($scope.selectedOption) {
                                        $scope.highlightedOption = $scope.selectedOption;
                                    }
                                }
                                break;
                            case Keys.enter:
                                e.preventDefault();
                                if ($scope.highlightedOption) {
                                    $scope.selectOption($scope.highlightedOption);
                                } else {
                                    var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                    if (exactMatches[0]) {
                                        $scope.selectOption(exactMatches[0]);
                                    }
                                }
                                break;
                            case Keys.escape:
                                $scope.closeAndClear();
                                break;
                            case Keys.del:
                                $scope.clearSelectedSearch();
                            case Keys.backspace:
                                if ($scope.ngModel != '')
                                    $scope.clearSelectedSearch();
                                break;
                        }
                    }
                    else if (e.which >= 65 && e.which <= 90) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();
                    }
                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;  // hotel show/hide auto generate
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option, $scope.cityType);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null, $scope.cityType);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {

                //scope.render = function () {
                //    scope.$emit('searchTerm');
                //};
                //scope.render();

                //scope.$watch('searchTerm', function (newValue, oldValue) {
                //    if (!newValue || angular.equals(newValue, oldValue))
                //        return;
                //    scope.render();
                //})

                //scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                //scope.setOptionWidth = function () {
                //    // console.log(inputElement.offsetWidth);
                //    $timeout(function () {
                //        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                //        scope.optionWidth = pixelWidth + 'px';
                //    });
                //};

                //angular.element(document).ready(function () {
                //    scope.setOptionWidth();
                //});

                //angular.element($window).bind('resize', function () {
                //    scope.setOptionWidth();
                //});
            }
        };
    }])
    .factory('autocomplete-keys', function () {
        return {
            upArrow: 38,
            downArrow: 40,
            enter: 13,
            escape: 27,
            backspace: 8,
            del: 46
        };
    })
    .directive("onlyDigits", function () {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                allowDecimal: '@',
                allowNegative: '@',
                minNum: '@',
                maxNum: '@'
            },

            link: function (scope, element, attrs, ngModel) {

                if (!ngModel) return;
                ngModel.$parsers.unshift(function (inputValue) {

                    var decimalFound = false;
                    var digits = inputValue.split('').filter(function (s, i) {
                        var b = (!isNaN(s) && s != ' ');
                        if (!b && attrs.allowDecimal && attrs.allowDecimal == "true") {
                            if (s == "." && decimalFound == false) {
                                decimalFound = true;
                                b = true;
                            }
                        }
                        if (!b && attrs.allowNegative && attrs.allowNegative == "true") {
                            b = (s == '-' && i == 0);
                        }

                        return b;
                    }).join('');

                    if (attrs.maxNum && !isNaN(attrs.maxNum) && parseFloat(digits) > parseFloat(attrs.maxNum)) {
                        digits = attrs.maxNum;
                    }
                    if (attrs.minNum && !isNaN(attrs.minNum) && parseFloat(digits) < parseFloat(attrs.minNum)) {
                        digits = attrs.minNum;
                    }

                    if (digits == "")
                        digits = 0;

                    ngModel.$viewValue = digits;
                    ngModel.$render();

                    return digits;
                });
            }
        };
    })

    //flightdatepickernew
    .directive('flightdatepickernew', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                cityType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                    new TinyPicker({
                        firstBox: document.getElementById('txt_dep0'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        type: 'flight',
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 1, formateDate(startDate), "Invalid date");


                            });
                        }
                    }).init();
                } if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                    new TinyPicker({
                        autoApply: true,
                        dateFormat: 'DD-MMM-YYYY',
                        firstBox: document.getElementById('txt_dep0'),
                        type: 'flight',
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                        lastBox: document.getElementById('txt_return'),
                        months: 2,
                        locale: {
                            format: 'DD-MMM-YYYY'
                        },
                        changeMonth: true,
                        changeYear: true,
                        success: function (startDate, endDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP-ARR", 1, formateDate(startDate), formateDate(endDate))

                            });
                        }
                    }).init();
                }
                //if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC") {
                //    for (var i = 0; i < scope.$parent.FlightSearchRQ.SearchRQ.Search.length; i++) {
                //        new TinyPicker({
                //            firstBox: document.getElementById("txt_depmc" + i),
                //            startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[i].DepartDateFormat), //addDays(new Date(), 3),
                //            months: 2,
                //            type: 'flight',
                //            days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                //            local: 'en-US',
                //            allowPast: false,
                //            ControlIndex: i,
                //            ServiceType: scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType,
                //            success: function (startDate, ControlIndex) {
                //                scope.$apply(function (scope) {
                //                    scope.$parent.$parent.fillDepartDate("DEP", i, formateDate(startDate), "Invalid date");
                //                });
                //            }
                //        }).init();
                //    }
                //}
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_depmc0"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 3, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();

                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_depmc1"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 4, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_depmc2"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[2].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 5, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_depmc3"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[3].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 6, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_depmc4"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[4].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 7, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_depmc5"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[5].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 8, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }


            }
        };
        return directiveDefinitionObject;
    }])
    //flightdatepickernew

    //flightHotelDatePicker
    .directive('flighthoteldatepickernew', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                cityType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                    new TinyPicker({
                        firstBox: document.getElementById('txt_depfh0'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat),
                        months: 2,
                        type: 'flight',
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 0, formateDate(startDate), "Invalid date");


                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                    new TinyPicker({
                        autoApply: true,
                        dateFormat: 'DD-MMM-YYYY',
                        firstBox: document.getElementById('txt_depfh0'),
                        type: 'flight',
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                        lastBox: document.getElementById('txt_returnfh'),
                        months: 2,
                        locale: {
                            format: 'DD-MMM-YYYY'
                        },
                        changeMonth: true,
                        changeYear: true,
                        success: function (startDate, endDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("ARR", scope.searchCount, formateDate(startDate), formateDate(endDate))
                                scope.$parent.fillHotelDate('CHKIN', formateDate(startDate));
                                scope.$parent.fillHotelDate('CHKOUT', formateDate(endDate));
                            });
                            new TinyPicker({
                                autoApply: false,
                                dateFormat: 'DD-MMM-YYYY',
                                firstBox: document.getElementById('hfchkin'),
                                startDate: dateformatt(scope.$parent.HotelCheckIn),
                                endDate: dateformatt(scope.$parent.HotelCheckOut),
                                //type: 'flight',
                                ModuleType: "PKG",
                                type: 'PKG',
                                lastBox: document.getElementById('hfchkout'),
                                months: 2,
                                //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                locale: {
                                    format: 'DD-MMM-YYYY'
                                },
                                changeMonth: true,
                                changeYear: true,
                                success: function (startDate, endDate) {
                                    //alert(startDate + ' ' + endDate);
                                    scope.$apply(function (scope) {
                                        scope.$parent.fillHotelDate('CHKIN', formateDate(startDate));
                                        scope.$parent.fillHotelDate('CHKOUT', formateDate(endDate));
                                    });
                                }
                                //err: function () { alert('err'); }
                            }).init();
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {
                    var dynamicid = "txt_depfh0" + scope.searchCount;
                    new TinyPicker({
                        //firstBox: document.getElementById('txt_dep+ '"+ scope.searchCount),
                        firstBox: document.getElementById('txt_depfh0'),
                        type: 'flight',
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (s, e) {
                            alert(s + ' ' + e);
                        }
                    }).init();
                }
            }
        };
        return directiveDefinitionObject;
    }])
    //flightHotelDatePicker

     .directive('flighthoteldatepickernewm', ['$parse', '$cookies', function ($parse, $cookies) {
         if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
             var month = 1;
         }
         else {
             var month = 2;

         }

         var directiveDefinitionObject = {
             restrict: 'A',
             scope: {
                 searchCount: '@',
                 cityType: '@',
                 ngModel: '='
             },
             link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                 function addDays(theDate, days) {
                     return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                 }
                 function formateDate(date) {
                     return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                 }
                 if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                     new TinyPicker({
                         firstBox: document.getElementById('txt_depfhm0'),
                         startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat),
                         months: 2,
                         type: 'flight',
                         days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                         local: 'en-US',
                         allowPast: false,
                         success: function (startDate) {
                             scope.$apply(function (scope) {
                                 scope.$parent.$parent.fillDepartDate("DEP", 0, formateDate(startDate), "Invalid date");


                             });
                         }
                     }).init();
                 }
                 if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                     new TinyPicker({
                         autoApply: true,
                         dateFormat: 'DD-MMM-YYYY',
                         firstBox: document.getElementById('txt_depfhm0'),
                         type: 'flight',
                         startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                         endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                         lastBox: document.getElementById('txt_returnfhm'),
                         months: 2,
                         locale: {
                             format: 'DD-MMM-YYYY'
                         },
                         changeMonth: true,
                         changeYear: true,
                         success: function (startDate, endDate) {
                             scope.$apply(function (scope) {
                                 scope.$parent.$parent.fillDepartDate("ARR", scope.searchCount, formateDate(startDate), formateDate(endDate))

                             });
                         }
                     }).init();
                 }

             }
         };
         return directiveDefinitionObject;
     }])
    //flightHotelDatePicker

    //FlightHotelDatePicker Not Result
    .directive('flighthoteldatepickernr', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                cityType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                    new TinyPicker({
                        firstBox: document.getElementById('txt_depfhnr'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat),
                        months: 2,
                        type: 'flight',
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 0, formateDate(startDate), "Invalid date");
                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                    new TinyPicker({
                        autoApply: true,
                        dateFormat: 'DD-MMM-YYYY',
                        firstBox: document.getElementById('txt_depfhnr'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                        lastBox: document.getElementById('txt_returnfhnr'),
                        months: 2,
                        locale: {
                            format: 'DD-MMM-YYYY'
                        },
                        changeMonth: true,
                        changeYear: true,
                        success: function (startDate, endDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("ARR", scope.searchCount, formateDate(startDate), formateDate(endDate))

                            });
                        }
                    }).init();
                }

            }
        };
        return directiveDefinitionObject;
    }])
    //FlightHotelDatePicker Not Result


    .directive('flightdatepickerr', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                cityType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                    //alert("1");
                    new TinyPicker({
                        firstBox: document.getElementById('txt_depowm'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        type: 'flight',
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", scope.searchCount, formateDate(startDate), "Invalid date");
                            });
                        }
                    }).init();
                } if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                    new TinyPicker({
                        autoApply: true,
                        dateFormat: 'DD-MMM-YYYY',
                        firstBox: document.getElementById('txt_deprtmm'),
                        type: 'flight',
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                        lastBox: document.getElementById('txt_returnrtmm'),
                        months: 2,
                        locale: {
                            format: 'DD-MMM-YYYY'
                        },
                        changeMonth: true,
                        changeYear: true,
                        success: function (startDate, endDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP-ARR", scope.searchCount, formateDate(startDate), formateDate(endDate));
                            });
                        }
                    }).init();
                }


                //if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC") {
                //    for (var i = 0; i < scope.$parent.FlightSearchRQ.SearchRQ.Search.length; i++) {
                //        new TinyPicker({
                //            firstBox: document.getElementById("txt_deprtmcm" + i),
                //            startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[i].DepartDateFormat), //addDays(new Date(), 3),
                //            months: 2,
                //            type: 'flight',
                //            days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                //            local: 'en-US',
                //            allowPast: false,
                //            ControlIndex: i + 3,
                //            success: function (startDate, ControlIndex) {
                //                scope.$apply(function (scope) {
                //                    scope.$parent.$parent.fillDepartDate("DEP", ControlIndex, formateDate(startDate), "Invalid date");
                //                });
                //            }
                //        }).init();
                //    }
                //}

                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcm0"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 3, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();

                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcm1"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 4, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcm2"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[2].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 5, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcm3"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[3].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 6, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcm4"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[4].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 7, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcm5"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[5].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 8, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }

            }
        };
        return directiveDefinitionObject;
    }])


    .directive('flightdatepickernr', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                cityType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                    //alert("1");
                    new TinyPicker({
                        firstBox: document.getElementById('txt_depownr'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        type: 'flight',
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", scope.searchCount, formateDate(startDate), "Invalid date");
                            });
                        }
                    }).init();
                } if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                    new TinyPicker({
                        autoApply: true,
                        dateFormat: 'DD-MMM-YYYY',
                        type: 'flight',
                        firstBox: document.getElementById('txt_deprtnrm'),
                        startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                        lastBox: document.getElementById('txt_returnrtm'),
                        months: 2,
                        locale: {
                            format: 'DD-MMM-YYYY'
                        },
                        changeMonth: true,
                        changeYear: true,
                        success: function (startDate, endDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP-ARR", scope.searchCount, formateDate(startDate), formateDate(endDate));
                            });
                        }
                    }).init();
                }

                //if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC") {
                //    for (var i = 0; i < scope.$parent.FlightSearchRQ.SearchRQ.Search.length; i++) {
                //        new TinyPicker({
                //            firstBox: document.getElementById("txt_deprtmcnr" + i),
                //            startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[i].DepartDateFormat), //addDays(new Date(), 3),
                //            months: 2,
                //            type: 'flight',
                //            days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                //            local: 'en-US',
                //            allowPast: false,
                //            ControlIndex: i + 3,
                //            success: function (startDate, ControlIndex) {
                //                scope.$apply(function (scope) {
                //                    scope.$parent.$parent.fillDepartDate("DEP", ControlIndex, formateDate(startDate), "Invalid date");

                //                });
                //            }
                //        }).init();
                //    }
                //}

                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcnr0"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 3, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();

                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcnr1"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 4, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcnr2"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[2].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 5, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcnr3"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[3].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 6, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcnr4"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[4].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 7, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }
                if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC" && scope.searchCount == "0") {

                    new TinyPicker({
                        firstBox: document.getElementById("txt_deprtmcnr5"),
                        startDate: new Date(scope.$parent.FlightSearchRQ.SearchRQ.Search[5].DepartDateFormat), //addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.$parent.fillDepartDate("DEP", 8, formateDate(startDate), "Invalid date");

                            });
                        }
                    }).init();
                }

            }
        };
        return directiveDefinitionObject;
    }])

    .directive('flightdatepickermob', ['$parse', '$cookies', function ($parse, $cookies) {
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                var month = 1;
            }
            else {
                var month = 2;

            }

            var directiveDefinitionObject = {
                restrict: 'A',
                scope: {
                    searchCount: '@',
                    cityType: '@',
                    ngModel: '='
                },
                link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                    function addDays(theDate, days) {
                        return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                    }
                    function formateDate(date) {
                        return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    }
                    if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "OW") {
                        //alert("1");
                        new TinyPicker({
                            firstBox: document.getElementById('txt_depowmob'),
                            startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                            months: 1,
                            type: 'flight',
                            days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                            local: 'en-US',
                            allowPast: false,
                            success: function (startDate) {
                                scope.$apply(function (scope) {
                                    scope.$parent.$parent.fillDepartDate("DEP", scope.searchCount, formateDate(startDate), "Invalid date");
                                });
                            }
                        }).init();
                    } if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "RT") {
                        new TinyPicker({
                            autoApply: true,
                            dateFormat: 'DD-MMM-YYYY',
                            type: 'flight',
                            firstBox: document.getElementById('txt_deprtmobm'),
                            startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[0].DepartDateFormat), //addDays(new Date(), 3),
                            endDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[1].DepartDateFormat),
                            lastBox: document.getElementById('txt_returmobtm'),
                            months: 1,
                            locale: {
                                format: 'DD-MMM-YYYY'
                            },
                            changeMonth: true,
                            changeYear: true,
                            success: function (startDate, endDate) {
                                scope.$apply(function (scope) {
                                    scope.$parent.$parent.fillDepartDate("DEP-ARR", scope.searchCount, formateDate(startDate), formateDate(endDate));
                                });
                            }
                        }).init();
                    }

                    if (scope.$parent.FlightSearchRQ.SearchRQ.GeneralInfo.TripType == "MC") {
                        for (var i = 0; i < scope.$parent.FlightSearchRQ.SearchRQ.Search.length; i++) {
                            new TinyPicker({
                                firstBox: document.getElementById("txt_deprtmcmob" + i),
                                startDate: dateformatt(scope.$parent.FlightSearchRQ.SearchRQ.Search[i].DepartDateFormat), //addDays(new Date(), 3),
                                months: 1,
                                type: 'flight',
                                days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                local: 'en-US',
                                allowPast: false,
                                ControlIndex: i + 3,
                                success: function (startDate, ControlIndex) {
                                    scope.$apply(function (scope) {
                                        scope.$parent.$parent.fillDepartDate("DEP", ControlIndex, formateDate(startDate), "Invalid date");

                                    });
                                }
                            }).init();
                        }
                    }

                }
            };
            return directiveDefinitionObject;
        }])


    .directive('hoteldatepicker', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

                new TinyPicker({
                    autoApply: false,
                    dateFormat: 'DD-MMM-YYYY',
                    firstBox: document.getElementById('CHKINHTL'),
                    startDate: dateformatt(scope.$parent.HotelCheckIn),
                    endDate: dateformatt(scope.$parent.HotelCheckOut),
                    lastBox: document.getElementById('CHKOUTHTL'),
                    months: 2,
                    //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    locale: {
                        format: 'DD-MMM-YYYY'
                    },
                    changeMonth: true,
                    changeYear: true,
                    success: function (startDate, endDate) {
                        //alert(startDate + ' ' + endDate);
                        scope.$apply(function (scope) {
                            scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                            scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                        });
                    }
                    //err: function () { alert('err'); }
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    //return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());

                }
            }
        };
        return directiveDefinitionObject;
    }])

.directive('hoteldatepickernr', ['$parse', '$cookies', function ($parse, $cookies) {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        var month = 1;
    }
    else {
        var month = 2;

    }

    var directiveDefinitionObject = {
        restrict: 'A',
        scope: {
            searchCount: '@',
            dateType: '@',
            ngModel: '='
        },
        link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

            new TinyPicker({
                autoApply: false,
                dateFormat: 'DD-MMM-YYYY',
                firstBox: document.getElementById('CHKINHTLNR'),
                startDate: new Date(scope.$parent.HotelCheckIn),
                endDate: new Date(scope.$parent.HotelCheckOut),
                lastBox: document.getElementById('CHKOUTHTLNR'),
                months: 2,
                locale: {
                    format: 'DD-MMM-YYYY'
                },
                changeMonth: true,
                changeYear: true,
                success: function (startDate, endDate) {
                    scope.$apply(function (scope) {
                        scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                        scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                    });
                }
            }).init();
            function addDays(theDate, days) {
                return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
            }
            function formateDate(date) {
                return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());


            }
        }
    };
    return directiveDefinitionObject;
}])

.directive('hoteldatepickerm', ['$parse', '$cookies', function ($parse, $cookies) {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        var month = 1;
    }
    else {
        var month = 2;

    }

    var directiveDefinitionObject = {
        restrict: 'A',
        scope: {
            searchCount: '@',
            dateType: '@',
            ngModel: '='
        },
        link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

            new TinyPicker({
                autoApply: false,
                dateFormat: 'DD-MMM-YYYY',
                firstBox: document.getElementById('CHKINHTLM'),
                startDate: new Date(scope.$parent.HotelCheckIn),
                endDate: new Date(scope.$parent.HotelCheckOut),
                lastBox: document.getElementById('CHKOUTHTLM'),
                months: 2,
                //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                locale: {
                    format: 'DD-MMM-YYYY'
                },
                changeMonth: true,
                changeYear: true,
                success: function (startDate, endDate) {
                    //alert(startDate + ' ' + endDate);
                    scope.$apply(function (scope) {
                        scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                        scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                    });
                }
                //err: function () { alert('err'); }
            }).init();
            function addDays(theDate, days) {
                return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
            }
            function formateDate(date) {
                return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());


            }

        }
    };
    return directiveDefinitionObject;
}])

    .directive('hoteldatepickermo', ['$parse', '$cookies', function ($parse, $cookies) {
        //if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        //    var month = 1;
        //}
        //else {
        //    var month = 2;

        //}
        var month = 1;
        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

                new TinyPicker({
                    autoApply: false,
                    dateFormat: 'DD-MMM-YYYY',
                    firstBox: document.getElementById('CHKINHTLMO'),
                    startDate: new Date(scope.$parent.HotelCheckIn),
                    endDate: new Date(scope.$parent.HotelCheckOut),
                    lastBox: document.getElementById('CHKOUTHTLMO'),
                    months: 1,
                    //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    locale: {
                        format: 'DD-MMM-YYYY'
                    },
                    changeMonth: true,
                    changeYear: true,
                    success: function (startDate, endDate) {
                        //alert(startDate + ' ' + endDate);
                        scope.$apply(function (scope) {
                            scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                            scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                        });
                    }
                    //err: function () { alert('err'); }
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());


                }

            }
        };
        return directiveDefinitionObject;
    }])


    .directive('activitydatepicker', ['$parse', function ($parse) {
        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {


                new TinyPicker({
                    autoApply: true,
                    dateFormat: 'DD-MMM-YYYY',
                    firstBox: document.getElementById('CHKINSSH'),
                    //startDate: addDays(new Date(), 3),
                    startDate: new Date(scope.$parent.ActivityFromDate),
                    endDate: new Date(scope.$parent.ActivityToDate),
                    lastBox: document.getElementById('CHKOUTSSH'),
                    months: 2,

                    //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    locale: {
                        format: 'DD-MMM-YYYY'
                    },
                    changeMonth: true,
                    changeYear: true,
                    success: function (startDate, endDate) {
                        scope.$apply(function (scope) {
                            scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                            scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                        });
                    },
                    //err: function () { alert('err'); }
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
            }
        };
        return directiveDefinitionObject;
    }])

.directive('activitydatepickerm', ['$parse', function ($parse) {
    var directiveDefinitionObject = {
        restrict: 'A',
        scope: {
            searchCount: '@',
            dateType: '@',
            ngModel: '='
        },
        link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {


            new TinyPicker({
                autoApply: true,
                dateFormat: 'DD-MMM-YYYY',
                firstBox: document.getElementById('CHKINSSHM'),
                startDate: new Date(scope.$parent.ActivityFromDate),
                endDate: new Date(scope.$parent.ActivityToDate),
                lastBox: document.getElementById('CHKOUTSSHM'),
                months: 2,

                //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                locale: {
                    format: 'DD-MMM-YYYY'
                },
                changeMonth: true,
                changeYear: true,
                success: function (startDate, endDate) {
                    scope.$apply(function (scope) {
                        scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                        scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                    });
                },
                //err: function () { alert('err'); }
            }).init();
            function addDays(theDate, days) {
                return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
            }
            function formateDate(date) {
                return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());


            }
        }
    };
    return directiveDefinitionObject;
}])

.directive('activitydatepickernr', ['$parse', function ($parse) {
    var directiveDefinitionObject = {
        restrict: 'A',
        scope: {
            searchCount: '@',
            dateType: '@',
            ngModel: '='
        },
        link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {


            new TinyPicker({
                autoApply: true,
                dateFormat: 'DD-MMM-YYYY',
                firstBox: document.getElementById('CHKINSSHNR'),
                startDate: new Date(scope.$parent.ActivityFromDate),
                endDate: new Date(scope.$parent.ActivityToDate),
                lastBox: document.getElementById('CHKOUTSSHNR'),
                months: 2,

                //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                locale: {
                    format: 'DD-MMM-YYYY'
                },
                changeMonth: true,
                changeYear: true,
                success: function (startDate, endDate) {
                    scope.$apply(function (scope) {
                        scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));
                        scope.$parent.fillDepartDate('CHKOUT', formateDate(endDate));
                    });
                },
                //err: function () { alert('err'); }
            }).init();
            function addDays(theDate, days) {
                return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
            }
            function formateDate(date) {
                return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());


            }
        }
    };
    return directiveDefinitionObject;
}])


        //activitydatepickernew
    .directive('activitydatepickernew', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                tjq(iElement).dateRangePicker({
                    separator: ' to ',
                    autoApply: true,
                    autoClose: true,
                    startDate: moment().add(3, 'day'),
                    format: 'DD-MM-YYYY',
                    getValue: function () {
                        var CheckDate = new Date(scope.$parent.ActivityDate)
                        if (CheckDate)
                            return scope.$parent.ActivityDate;
                        else
                            return '';
                    },
                    setValue: function (s, s1, s2) {
                        if (s1 && s2) {
                            scope.$apply(function (scope) {
                                scope.$parent.fillDepartDate("CHKIN", s1);
                                scope.$parent.fillDepartDate("CHKOUT", s2);
                            });
                        }
                    }
                });
            }
        };
        return directiveDefinitionObject;
    }])
     .directive('flighthoteldatepicker', ['$parse', '$filter', function ($parse, $filter) {
         var directiveDefinitionObject = {
             restrict: 'A',
             scope: {
                 searchCount: '@',
                 cityType: '@',
                 ngModel: '='
             },
             link: function postLink(scope, iElement, iAttrs, ngModelCtrl, filter) {

                 tjq(iElement).datepicker({
                     dateFormat: 'd-M-yy',
                     numberOfMonths: 2,
                     autoclose: false,
                     onSelect: function (dateText, inst) {
                         scope.$apply(function (scope) {
                             scope.$parent.$parent.fillDepartDate(scope.cityType, scope.searchCount, dateText);
                         });
                     },
                     beforeShow: function (input, inst) {

                         var month = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };
                         var getProperty = function (propertyName) {
                             return month[propertyName];
                         };

                         var dateArray = scope.ngModel.split('-');

                         var minStartDate;
                         var maxEndDate;
                         var defaultDate = new Date(dateArray[2] + '-' + getProperty(dateArray[1]) + '-' + dateArray[0]);

                         scope.$apply(function (scope) {
                             minStartDate = scope.$parent.$parent.getMinDate(scope.cityType, scope.searchCount);
                             maxEndDate = new Date(minStartDate);
                             maxEndDate.setDate(maxEndDate.getDate() + 365)
                         });

                         return { minDate: minStartDate, defaultDate: defaultDate, maxDate: maxEndDate }
                     }
                 });
             }
         };
         return directiveDefinitionObject;
     }])
    .directive('hotelflightdatepicker', ['$parse', function ($parse) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

                new TinyPicker({
                    autoApply: false,
                    dateFormat: 'DD-MMM-YYYY',
                    firstBox: document.getElementById('hfchkin'),
                    startDate: dateformatt(scope.$parent.HotelCheckIn),
                    endDate: dateformatt(scope.$parent.HotelCheckOut),
                    //type: 'flight',
                    ModuleType: "PKG",
                    type: 'PKG',
                    lastBox: document.getElementById('hfchkout'),
                    months: 2,
                    //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    locale: {
                        format: 'DD-MMM-YYYY'
                    },
                    changeMonth: true,
                    changeYear: true,
                    success: function (startDate, endDate) {
                        //alert(startDate + ' ' + endDate);
                        scope.$apply(function (scope) {
                            scope.$parent.fillHotelDate('CHKIN', formateDate(startDate));
                            scope.$parent.fillHotelDate('CHKOUT', formateDate(endDate));
                        });
                    }
                    //err: function () { alert('err'); }
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    //return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());

                }
            }
        };
        return directiveDefinitionObject;
    }])

    .directive('hfmdatepicker', ['$parse', function ($parse) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

                new TinyPicker({
                    autoApply: false,
                    dateFormat: 'DD-MMM-YYYY',
                    firstBox: document.getElementById('hfmchkin'),
                    startDate: dateformatt(scope.$parent.HotelCheckIn),
                    endDate: dateformatt(scope.$parent.HotelCheckOut),
                    lastBox: document.getElementById('hfmchkout'),
                    months: 2,
                    //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    locale: {
                        format: 'DD-MMM-YYYY'
                    },
                    changeMonth: true,
                    changeYear: true,
                    success: function (startDate, endDate) {
                        //alert(startDate + ' ' + endDate);
                        scope.$apply(function (scope) {
                            scope.$parent.fillHotelDate('CHKIN', formateDate(startDate));
                            scope.$parent.fillHotelDate('CHKOUT', formateDate(endDate));
                        });
                    }
                    //err: function () { alert('err'); }
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    //return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());

                }
            }
        };
        return directiveDefinitionObject;
    }])


    .directive('hfmdatepickernr', ['$parse', function ($parse) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {

                new TinyPicker({
                    autoApply: false,
                    dateFormat: 'DD-MMM-YYYY',
                    firstBox: document.getElementById('hfmchkinnr'),
                    startDate: dateformatt(scope.$parent.HotelCheckIn),
                    endDate: dateformatt(scope.$parent.HotelCheckOut),
                    lastBox: document.getElementById('hfmchkoutnr'),
                    months: 2,
                    //days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    locale: {
                        format: 'DD-MMM-YYYY'
                    },
                    changeMonth: true,
                    changeYear: true,
                    success: function (startDate, endDate) {
                        //alert(startDate + ' ' + endDate);
                        scope.$apply(function (scope) {
                            scope.$parent.fillHotelDate('CHKIN', formateDate(startDate));
                            scope.$parent.fillHotelDate('CHKOUT', formateDate(endDate));
                        });
                    }
                    //err: function () { alert('err'); }
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    //return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());

                }
            }
        };
        return directiveDefinitionObject;
    }])



    .directive('packagedatepicker', ['$parse', function ($parse) {
        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '=',
                endDate: '@'
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                var nextdate = new Date();
                nextdate.setDate(nextdate.getDate() + 1);

                var lastdate = new Date(scope.endDate);
                var timeDiff = Math.abs(nextdate.getTime() - lastdate.getTime());
                var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //return dayDifference;

                //alert(scope.endDate);
                tjq(iElement).datepicker({
                    dateFormat: 'd-M-yy',
                    numberOfMonths: 2,
                    autoclose: false,
                    minDate: 0,
                    onSelect: function (dateText, inst) {
                        scope.$apply(function (scope) {
                            scope.$parent.fillDepartDate(scope.dateType, dateText);
                        });
                    },
                    beforeShowDay: function (date) {
                        return [scope.$parent.DisableSpecificDates(date), ''];
                        // return scope.$parent.DisableSpecificDates
                    }
                    ,
                    beforeShow: function (input, inst) {
                        var minStartDate;
                        var maxEndDate;
                        var defaultDate = new Date(scope.ngModel);

                        scope.$apply(function (scope) {
                            minStartDate = scope.$parent.getMinDate(scope.dateType);
                            maxEndDate = new Date(minStartDate);
                            maxEndDate.setDate(maxEndDate.getDate() + dayDifference)
                            //maxEndDate = scope.$parent.getMaxDate(scope.dateType);
                        });

                        //   if (scope.$parent.DisableSpecificDates) {

                        return { minDate: minStartDate, defaultDate: defaultDate, maxDate: maxEndDate }
                        // }else{return false}
                    }
                });
            }
        };
        return directiveDefinitionObject;
    }])
    .directive('paymentcartamount', ['$parse', function ($parse) {
        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                totalPrice: '@'
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                //alert(scope.totalPrice);
            }
        };
        return directiveDefinitionObject;
    }])

    .directive('packagecityautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" style="padding-left: 34px;text-transform: capitalize;" type="text" onfocus="this.select();" class="input-text form-control alignRight" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches"   uib-tooltip="{{option[displayProperty]}} ">' +
                       "<span class ='capitalize'><span ng-if='option[iconType] == cityType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='soap-icon-hotel-2'></i></span> <span ng-if='option[iconType] == locationType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-map-marker' aria-hidden='true'></i></span> <span ng-if='option[iconType] == hotelType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-bed' aria-hidden='true'></i></span> {{option[displayProperty] | limitTo : 45 | lowercase}}{{option[displayProperty].length > 45 ? '...' : ''}}</span>" +
                    '</li>' +
                '</ul>' +
                '</div></div>' +
                '</div>' +
                '</div>',
            //'<span ng-if="selectedOption.Type == cityType" style="position: absolute;left: 16px;top: 71px;"><i class="soap-icon-hotel-2"></i></span> <span ng-if="selectedOption.Type == locationType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-map-marker" aria-hidden="true"></i></span> <span ng-if="selectedOption.Type == hotelType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-bed" aria-hidden="true"></i></span>',

            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '=',
                iconType: '@'
            },
            controller: function ($scope, PackageFactory) {
                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.cityType = "city";


                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    $scope.SearchTxt = term;
                    $scope.showOptions = true;
                    $scope.CityLoader = true;
                    $scope.hasMatches = false;
                    if (term.length > 2) {
                        if ($scope.selectedOption) {

                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }

                        PackageFactory.PackageCountryCityList(term).then(function (response) {
                            if (response.DestinationResponse != null) {
                                $scope.matchingOptions = response.DestinationResponse.Category;
                                if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                    $scope.clearHighlight();
                                }

                                $scope.showOptions = true;
                                if ($scope.matchingOptions.length == 0) {
                                    $scope.hasMatches = true;
                                    $scope.CityLoader = false;
                                }
                                else {
                                    $scope.CityLoader = false;
                                    $scope.hasMatches = false;
                                }
                            }
                            else {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                                $scope.matchingOptions = [];
                            }


                        });

                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();

                    }
                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();
                    }
                    else {
                        if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                            switch (e.which) {
                                case Keys.upArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightPrevious();
                                    }
                                    break;
                                case Keys.downArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightNext();
                                    } else {
                                        $scope.showOptions = true;
                                        if ($scope.selectedOption) {
                                            $scope.highlightedOption = $scope.selectedOption;
                                        }
                                    }
                                    break;
                                case Keys.enter:
                                    e.preventDefault();
                                    if ($scope.highlightedOption) {
                                        $scope.selectOption($scope.highlightedOption);
                                    } else {
                                        var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                        if (exactMatches[0]) {
                                            $scope.selectOption(exactMatches[0]);
                                        }
                                    }
                                    break;
                                case Keys.escape:
                                    $scope.closeAndClear();
                                    break;
                                case Keys.del:
                                    $scope.clearSelectedSearch();
                                case Keys.backspace:
                                    if ($scope.ngModel != '')
                                        $scope.clearSelectedSearch();
                                    break;
                            }
                        }
                        else if (e.which >= 65 && e.which <= 90) {
                            if ($scope.ngModel != '')
                                $scope.clearSelectedSearch();
                        }
                    }

                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;  // hotel show/hide auto generate
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {
                scope.optionWidth = '100%';
                var inputElement = elem.children('.autocomplete-input')[0];

                scope.setOptionWidth = function () {
                    // console.log(inputElement.offsetWidth);
                    $timeout(function () {
                        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                        scope.optionWidth = pixelWidth + 'px';
                    });
                };

                angular.element(document).ready(function () {
                    scope.setOptionWidth();
                });

                angular.element($window).bind('resize', function () {
                    scope.setOptionWidth();
                });
            }
        };
    }])

    .directive('typeahead', function () {
        return {
            restict: 'AEC',
            scope: {
                items: '=',
                inputClass: '@',
                placeHolder: '@',
                alertMsg: '@'
            },
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                var blur = false;
                scope.focused = false;
                scope.limitcrossed = false;
                scope.list = [];
                scope.listkey = [];
                scope.filteredItems = scope.items;
                scope.selPos = 0;

                scope.focusIn = function () {
                    if (!scope.focused) {
                        scope.focused = true;
                        blur = false;
                        scope.selPos = 0;
                    }
                };

                scope.focusOut = function () {
                    scope.itemsearch = "";
                    if (!blur) {
                        scope.focused = false;
                    } else {
                        angular.element(elem).find('input')[0].focus();
                        blur = false;
                    }
                };

                // Change me for custom display name on select list
                scope.getDisplayItem = function (item) {
                    return item[attrs.displayitem];
                };

                // Change me for custom display name on tags (chips)
                scope.getDisplayTag = function (item) {
                    return item[attrs.displaytag];
                };

                scope.addItem = function (item) {
                    if (item) {
                        if (scope.list.length < 3) {
                            scope.list.push(item);
                            scope.listkey.push(item[attrs.itemkey]);

                            scope.itemsearch = "";
                            blur = true;
                            if (scope.selPos >= scope.filteredItems.length - 1) {
                                scope.selPos--; // To keep hover selection
                            }
                            ngModel.$setViewValue(scope.listkey);
                        }
                        else { scope.limitcrossed = true; }
                    }
                };

                scope.removeItem = function (item) {
                    scope.list.splice(scope.list.indexOf(item), 1);
                    scope.listkey.splice(scope.listkey.indexOf(item[attrs.itemkey]), 1);
                    ngModel.$setViewValue(scope.listkey);
                    scope.limitcrossed = false;
                };

                scope.hover = function (index) {
                    scope.selPos = index;
                };

                scope.keyPress = function (evt) {
                    var keys = {
                        38: 'up',
                        40: 'down',
                        8: 'backspace',
                        13: 'enter',
                        9: 'tab',
                        27: 'esc'
                    };

                    switch (evt.keyCode) {
                        case 27:
                            scope.focusOut();
                            break;
                        case 13:
                            if (scope.selPos > -1) {
                                scope.addItem(scope.filteredItems[scope.selPos]);
                            }
                            break;
                        case 8:
                            if (!scope.itemsearch || scope.itemsearch.length == 0) {
                                if (scope.list.length > 0) {
                                    scope.list.pop();
                                }
                            }
                            break;
                        case 38:
                            if (scope.selPos > 0) {
                                scope.selPos--;
                            }
                            break;
                        case 40:
                            if (scope.selPos < scope.filteredItems.length - 1) {
                                scope.selPos++;
                            }
                            break;
                        default:
                            scope.selPos = 0;
                            scope.focusIn();
                    }
                };
            },

            template: '<div class="typeahead">\
                            <span ng-if="limitcrossed" class="airlinealert">{{alertMsg}}</span><input data-ng-blur="focusOut()" focus="{{focused}}" data-ng-model-options="{debounce: 500}" type="text" data-ng-model="itemsearch" data-ng-keydown="keyPress($event)" class="{{inputClass}}" data-ng-click="focusIn()"/>\
                            <ul data-ng-class="{\'focused\': focused}" class="tags">\
                              <li class="tag" data-ng-repeat="s in list track by $index"> {{getDisplayTag(s)}} <span data-ng-click="removeItem(s)">x</span></li>\
                            </ul>\
                            <ul class="list" data-ng-show="focused">\
                              <li data-ng-class="{\'active\': selPos == $index}" \
                                  data-ng-repeat="item in (filteredItems = (items | notin: list | filter: itemsearch | limitTo: 10)) track by $index" \
                                  data-ng-mousedown="addItem(item)" data-ng-mouseover="hover($index)">\
                              {{getDisplayItem(item)}}\
                              </li>\
                            </ul>\
                       </div>'
        };
    })
    .directive('focus', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                attrs.$observe('focus', function (newValue) {
                    if (newValue == 'true') {
                        element[0].focus();
                    }
                });
            }
        }
    })
    .filter('notin', function () {
        return function (listin, listout) {
            return listin.filter(function (el) {
                return listout.indexOf(el) == -1;
            });
        };
    })
    .filter('split', function () {
        return function (input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];
        }
    })
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .filter('range', function () {
        return function (input, total) {
            total = parseInt(total);

            for (var i = 0; i < total; i++) {
                input.push(i);
            }

            return input;
        }
    })
       .directive('rangeSpinner', function () {
           return {
               restrict: 'AE',
               scope: {
                   rangeMin: "@",
                   rangeStep: "@",
                   rangeMax: "@",
                   rangeDefaultValue: "@",
                   acceptDecimal: "@",
                   rangeModel: "=",
                   nameOfField: "@",
                   idOfField: "@",
                   spinerOfIndex: "@",
                   spinnerOfType: "@",
                   spinnerOfSubindex: "@",
                   rangeDecimalPrecision: "@",
                   parentModel: "="
               },
               templateUrl: 'tmpl/rangeSpinner.html',
               controller: function ($scope, $element, $attrs) {

                   //Initializing minRange, step and maxRange with default Value if not provided.
                   $scope.minRange = +(angular.isDefined($attrs.rangeMin) ? $attrs.rangeMin : 0);
                   $scope.step = +(angular.isDefined($attrs.rangeStep) ? $attrs.rangeStep : 0);
                   $scope.maxRange = +(angular.isDefined($attrs.rangeMax) ? $attrs.rangeMax : 100);
                   $scope.rangeDecPrec = +(angular.isDefined($attrs.rangeDecimalPrecision) ? $attrs.rangeDecimalPrecision : 1);

                   //Initializing rangeModel with default Value if supplied rangeDefaultValue is not between minRange and maxRange.
                   if (angular.isDefined($scope.rangeDefaultValue) && !isNaN($scope.rangeDefaultValue)) {
                       var rangeDefaultVal = parseFloat($scope.rangeDefaultValue);
                       if (rangeDefaultVal >= $scope.minRange && rangeDefaultVal <= $scope.maxRange) {
                           $scope.rangeModel = parseFloat($scope.rangeDefaultValue).toFixed($scope.rangeDecPrec);
                       } else {
                           $scope.rangeModel = parseFloat($scope.minRange).toFixed($scope.rangeDecPrec);
                       }
                   }

                   //Plus Button Method
                   $scope.rangePlusFunc = function () {

                       /* execute if condition in flight case when parentModel is coming otherwise execute else condition : added by tarun sharma 19-Sep-2017 */
                       if (angular.isDefined($scope.parentModel)) {
                           var totalPaxCount = 0;

                           if ($scope.parentModel.Adult != undefined && $scope.parentModel.Adult != null && $scope.parentModel.Child != undefined && $scope.parentModel.Adult != Child)      // condition added for transfer
                               totalPaxCount = parseInt($scope.parentModel.Adult) + parseInt($scope.parentModel.Child)
                           else
                               totalPaxCount = parseInt($scope.parentModel.Adults) + parseInt($scope.parentModel.Childs)

                           if (totalPaxCount < 9 || $scope.idOfField == "Infant") {
                               if ($scope.idOfField == "Infant") {                                                 // set adult count in infant max value
                                   $scope.maxRange = parseInt($scope.parentModel.Adults);
                               }
                               if (angular.isUndefined($scope.rangeModel) || isNaN($scope.rangeModel) || $scope.rangeModel === "") {
                                   $scope.rangeModel = $scope.minRange;
                               } else {
                                   if ($scope.rangeModel < $scope.maxRange) {
                                       if ($scope.acceptDecimal == 'true') {
                                           $scope.rangeModel = (parseFloat(parseFloat($scope.rangeModel) + parseFloat($scope.step))).toFixed($scope.rangeDecPrec);
                                       } else {
                                           $scope.rangeModel = (parseInt(parseInt($scope.rangeModel) + parseInt($scope.step)));
                                           if ($scope.rangeModel == $scope.maxRange) {
                                               tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.pluscls').attr('disabled', true);
                                           }
                                           else {
                                               tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.pluscls').attr('disabled', false);
                                               tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.minuscls').attr('disabled', false);
                                           }
                                       }
                                   }
                               }
                           }
                       } else {
                           if (angular.isUndefined($scope.rangeModel) || isNaN($scope.rangeModel) || $scope.rangeModel === "") {
                               $scope.rangeModel = $scope.minRange;
                           } else {
                               if ($scope.rangeModel < $scope.maxRange) {
                                   if ($scope.acceptDecimal == 'true') {
                                       $scope.rangeModel = (parseFloat(parseFloat($scope.rangeModel) + parseFloat($scope.step))).toFixed($scope.rangeDecPrec);
                                   } else {
                                       $scope.rangeModel = (parseInt(parseInt($scope.rangeModel) + parseInt($scope.step)));
                                       if ($scope.rangeModel == $scope.maxRange) {
                                           tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.pluscls').attr('disabled', true);
                                       }
                                       else {
                                           tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.pluscls').attr('disabled', false);
                                           tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.minuscls').attr('disabled', false);
                                       }
                                   }
                               }
                           }
                       }
                   };

                   //Minus Button Method
                   $scope.rangeMinusFunc = function () {

                       if (angular.isUndefined($scope.rangeModel) || isNaN($scope.rangeModel) || $scope.rangeModel === "") {
                           $scope.rangeModel = $scope.minRange;
                       } else {
                           if ($scope.rangeModel > $scope.minRange) {
                               if ($scope.acceptDecimal == 'true') {
                                   $scope.rangeModel = (parseFloat(parseFloat($scope.rangeModel) - parseFloat($scope.step))).toFixed($scope.rangeDecPrec);
                               } else {
                                   $scope.rangeModel = (parseInt(parseInt($scope.rangeModel) - parseInt($scope.step)));
                               }
                           }
                           if ($scope.rangeModel == $scope.minRange) {
                               tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.minuscls').attr('disabled', true);
                           }
                           else {
                               tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.minuscls').attr('disabled', false);
                               tjq('#' + $scope.spinnerOfType + $scope.spinerOfIndex + $scope.spinnerOfSubindex + ' a.pluscls').attr('disabled', false);
                           }
                       }

                       /* reset infant model value when adult count is less than infant count in flight case : added by tarun sharma 19-Sep-2017 */
                       if (angular.isDefined($scope.parentModel) && $scope.idOfField == "adults" && parseInt($scope.parentModel.Adults) - 1 < parseInt($scope.parentModel.Infant)) {
                           $scope.parentModel.Infant = 0;
                       }
                   };

                   //For Direct Editing
                   $scope.$watch(function () {
                       return $scope.rangeModel;
                   }, function (newvalue, oldvalue) {

                       if (angular.isDefined($scope.rangeModel)) {
                           if (!isNaN($scope.rangeModel)) {
                               if ($scope.rangeModel > $scope.maxRange) {
                                   $scope.rangeModel = $scope.maxRange;
                               } else if ($scope.rangeModel < $scope.minRange) {
                                   $scope.rangeModel = $scope.minRange;
                               } else {

                                   if ($scope.acceptDecimal == 'true') {
                                       var precision = String($scope.rangeModel).split(".");
                                       if (precision.length > 1 && precision[1].length > $scope.rangeDecPrec) {
                                           $scope.rangeModel = (parseFloat($scope.rangeModel)).toFixed($scope.rangeDecPrec);
                                       }
                                   } else {
                                       $scope.rangeModel = parseInt($scope.rangeModel);
                                   }
                               }
                           } else {
                               $scope.rangeModel = oldvalue;
                           }
                       }
                   }, true);

               }
           };
       })
    .directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    angular.element(this).parent().remove();
                });
            }
        }
        return fallbackSrc;
    })
    .service('anchorSmoothScroll', function () {
        this.scrollTo = function (eID, flag) {

            // This scrolling function 
            // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
            var fixedToppHeight = tjq("#fixedTop").height();

            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            if (eID != "fixedTop") {
                stopY = stopY - fixedToppHeight;
            }
            if (tjq("#fixedTop").hasClass("affix-top")) {
                stopY = stopY - 82;
            }
            //if (flag) {
            //    stopY = stopY + 358;
            //}

            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 40);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }

            function currentYPosition() {
                // Firefox, Chrome, Opera, Safari
                if (self.pageYOffset) return self.pageYOffset;
                // Internet Explorer 6 - standards mode
                if (document.documentElement && document.documentElement.scrollTop)
                    return document.documentElement.scrollTop;
                // Internet Explorer 6, 7 and 8
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }

            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                } return y;
            }

        };
    })
    .directive('transferdatepicker', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                tjq(iElement).datepicker({
                    dateFormat: 'd-M-yy',
                    numberOfMonths: month,
                    autoclose: false,
                    closeText: closeText[$cookies.get("culture")],
                    prevText: prevText[$cookies.get("culture")],
                    nextText: nextText[$cookies.get("culture")],
                    currentText: currentText[$cookies.get("culture")],
                    monthNames: monthNames[$cookies.get("culture")],
                    monthNamesShort: monthNamesShort[$cookies.get("culture")],
                    dayNames: dayNames[$cookies.get("culture")],
                    dayNamesShort: dayNamesShort[$cookies.get("culture")],
                    dayNamesMin: dayNamesMin[$cookies.get("culture")],
                    weekHeader: weekHeader[$cookies.get("culture")],
                    isRTL: isRTL[$cookies.get("culture")],
                    showMonthAfterYear: false,
                    yearSuffix: "",
                    onSelect: function (dateText, inst) {
                        scope.$apply(function (scope) {
                            scope.$parent.fillDepartDate(scope.dateType, dateText);
                        });
                    },
                    beforeShow: function (input, inst) {

                        var month = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };
                        var getProperty = function (propertyName) {
                            return month[propertyName];
                        };

                        var dateArray = scope.ngModel.split(' ');
                        if (dateArray.length <= 1) { dateArray = scope.ngModel.split('-') }

                        var minStartDate;
                        var maxEndDate;
                        var defaultDate = new Date(dateArray[2] + '-' + getProperty(dateArray[1]) + '-' + dateArray[0]);


                        scope.$apply(function (scope) {
                            minStartDate = scope.$parent.getMinDate(scope.dateType);
                            minStartDate.setDate(minStartDate.getDate() + 3);
                            maxEndDate = new Date(minStartDate); //Date.parse(minStartDate);//
                            maxEndDate.setDate(maxEndDate.getDate() + 365)
                        });

                        return { minDate: minStartDate, defaultDate: defaultDate, maxDate: maxEndDate }
                    }
                });
            }
        };
        return directiveDefinitionObject;
    }])
    //transferdatepickernew
    .directive('transferdatepickernew', ['$parse', '$cookies', function ($parse, $cookies) {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            var month = 1;
        }
        else {
            var month = 2;

        }

        var directiveDefinitionObject = {
            restrict: 'A',
            scope: {
                searchCount: '@',
                dateType: '@',
                ngModel: '='
            },
            link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                new TinyPicker({
                    firstBox: document.getElementById('CHKINTRF'),
                    startDate: dateformatt(scope.$parent.TransferDate),
                    months: 2,
                    days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    local: 'en-US',
                    allowPast: false,
                    success: function (startDate) {
                        scope.$apply(function (scope) {
                            scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));

                        });
                    },
                }).init();
                function addDays(theDate, days) {
                    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                }
                function formateDate(date) {
                    return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                }
            }
        };
        return directiveDefinitionObject;
    }])

        .directive('transferdatepickernewnr', ['$parse', '$cookies', function ($parse, $cookies) {
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                var month = 1;
            }
            else {
                var month = 2;

            }

            var directiveDefinitionObject = {
                restrict: 'A',
                scope: {
                    searchCount: '@',
                    dateType: '@',
                    ngModel: '='
                },
                link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                    new TinyPicker({
                        firstBox: document.getElementById('CHKINTRFNR'),
                        startDate: dateformatt(scope.$parent.TransferDate),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));

                            });
                        },
                    }).init();
                    function addDays(theDate, days) {
                        return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                    }
                    function formateDate(date) {
                        return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    }
                }
            };
            return directiveDefinitionObject;
        }])

      
        .directive('transferdatepickernewnmo', ['$parse', '$cookies', function ($parse, $cookies) {
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                var month = 1;
            }
            else {
                var month = 2;

            }

            var directiveDefinitionObject = {
                restrict: 'A',
                scope: {
                    searchCount: '@',
                    dateType: '@',
                    ngModel: '='
                },
                link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                    new TinyPicker({
                        firstBox: document.getElementById('CHKINTRFNRMO'),
                        startDate: addDays(new Date(), 3),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));

                            });
                        },
                    }).init();
                    function addDays(theDate, days) {
                        return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                    }
                    function formateDate(date) {
                        return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    }
                }
            };
            return directiveDefinitionObject;
        }])


        

        .directive('transferdatepickernewm', ['$parse', '$cookies', function ($parse, $cookies) {
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                var month = 1;
            }
            else {
                var month = 2;

            }

            var directiveDefinitionObject = {
                restrict: 'A',
                scope: {
                    searchCount: '@',
                    dateType: '@',
                    ngModel: '='
                },
                link: function postLink(scope, iElement, iAttrs, ngModelCtrl) {
                    new TinyPicker({
                        firstBox: document.getElementById('CHKINTRFM'),
                        startDate: dateformatt(scope.$parent.TransferDate),
                        months: 2,
                        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        local: 'en-US',
                        allowPast: false,
                        success: function (startDate) {
                            scope.$apply(function (scope) {
                                scope.$parent.fillDepartDate('CHKIN', formateDate(startDate));

                            });
                        },
                    }).init();
                    function addDays(theDate, days) {
                        return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
                    }
                    function formateDate(date) {
                        return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                    }
                }
            };
            return directiveDefinitionObject;
        }])


    .directive('imageLazySrc', function ($document, $window) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attributes) {

                function isInView() {

                    // get current viewport position and dimensions, and image position
                    var clientHeight = $document[0].documentElement.clientHeight,
                        clientWidth = $document[0].documentElement.clientWidth,
                        imageRect = $element[0].getBoundingClientRect();

                    if (
                        (imageRect.top >= 0 && imageRect.bottom <= clientHeight)
                        &&
                        (imageRect.left >= 0 && imageRect.right <= clientWidth)
                    ) {
                        $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)

                        // unbind event listeners when image src has been set
                        removeEventListeners();
                    }
                }

                function removeEventListeners() {
                    $window.removeEventListener('scroll', isInView);
                    $window.removeEventListener('resize', isInView);
                }

                // bind scroll and resize event listener to window
                $window.addEventListener('scroll', isInView);
                $window.addEventListener('resize', isInView);

                // unbind event listeners if element was destroyed
                // it happens when you change view, etc
                $element.on('$destroy', function () {
                    removeEventListeners();
                });

                // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                isInView();
            }
        };
    })


    // Add by Akash tyagi 

    .directive('transfercityautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            
                template: '<input autocomplete="off" type="text" onfocus="this.select();" class="form-control input-text alignRight dtrf{{cityType}}" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width">' +
                    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches">' +
                        '<span><i class="soap-icon-hotel-2" style="font-size: 17px;vertical-align:baseline !important"></i> {{option[displayProperty]}}</span>' +
                    '</li>' +
                '</ul>' +
                //'<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                //    '<li class="autocomplete-option" style="padding: 5px 10px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-repeat="option in matchingOptions"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches"   uib-tooltip="{{option[displayProperty]}} " tooltip-append-to-body="true">' +
                //       " <span><span ng-if='option[iconType] == cityType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='soap-icon-hotel-2'></i></span> <span ng-if='option[iconType] == locationType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-map-marker' aria-hidden='true'></i></span> <span ng-if='option[iconType] == hotelType' style='width: 24px;float: left;font-size: 17px;line-height: 16px;'><i class='fa fa-bed' aria-hidden='true'></i></span> {{option[displayProperty] | limitTo : 45 }}{{option[displayProperty].length > 45 ? '...' : ''}}</span>" +
                //    '</li>' +
                //'</ul>' +
                '</div></div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '=',
                cityType: '@'
            },
            controller: function ($scope, TransferFactory) {
                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.cityType = "City";
                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    $scope.CityLoader = true;
                    if (term.length > 2) {
                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }


                        TransferFactory.CityList(term).then(function (response) {
                            $scope.matchingOptions = response.CityResponse.Details.City;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }

                            $scope.showOptions = true;
                            if ($scope.matchingOptions.length == 0) {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                            }
                            else {
                                $scope.CityLoader = false;
                                $scope.hasMatches = false;
                            }

                        });

                        //ActivityFactory.CityList(term).then(function (response) {
                        //    $scope.matchingOptions = response.CityResponse.Details.City;
                        //    if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                        //        $scope.clearHighlight();
                        //    }
                        //    $scope.hasMatches = $scope.matchingOptions.length > 0;
                        //    $scope.showOptions = true;
                        //});
                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();
                    }
                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();
                    }
                    else {
                        if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                            switch (e.which) {
                                case Keys.upArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightPrevious();
                                    }
                                    break;
                                case Keys.downArrow:
                                    e.preventDefault();
                                    if ($scope.showOptions) {
                                        $scope.highlightNext();
                                    } else {
                                        $scope.showOptions = true;
                                        if ($scope.selectedOption) {
                                            $scope.highlightedOption = $scope.selectedOption;
                                        }
                                    }
                                    break;
                                case Keys.enter:
                                    e.preventDefault();
                                    if ($scope.highlightedOption) {
                                        $scope.selectOption($scope.highlightedOption);
                                    } else {
                                        var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                        if (exactMatches[0]) {
                                            $scope.selectOption(exactMatches[0]);
                                        }
                                    }
                                    break;
                                case Keys.escape:
                                    $scope.closeAndClear();
                                    break;
                                case Keys.del:
                                    $scope.clearSelectedSearch();
                                case Keys.backspace:
                                    if ($scope.ngModel != '')
                                        $scope.clearSelectedSearch();
                                    break;
                            }
                        }
                        else if (e.which >= 65 && e.which <= 90) {
                            if ($scope.ngModel != '')
                                $scope.clearSelectedSearch();
                        }
                    }
                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option, $scope.cityType);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null, $scope.cityType);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {
                scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                scope.setOptionWidth = function () {
                    // console.log(inputElement.offsetWidth);
                    $timeout(function () {
                        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                        scope.optionWidth = pixelWidth + 'px';
                    });
                };

                angular.element(document).ready(function () {
                    scope.setOptionWidth();
                });

                angular.element($window).bind('resize', function () {
                    scope.setOptionWidth();
                });
            }
        };
    }])
    .directive('ptransferautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" style="padding-left: 34px;" type="text" onfocus="this.select();" class="form-control input-text full-width alignRight" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                    '<span ng-repeat="option in matchingOptions"> ' +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeAcc'><i class='fa fa-bed' aria-hidden='true' style='font-size: 23px;vertical-align: bottom !important;'></i> Accomodation <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeAir'><i class='fa fa-plane landing-effect' aria-hidden='true'></i> Airport <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeSta'><i class='fa fa-train' aria-hidden='true'></i> Station <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypePor'><i class='fa fa-ship' aria-hidden='true'></i> Port <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeZon'><i class='fa fa-map-marker' aria-hidden='true'></i> Zone <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    '<span ng-if="option[pointType] != PointTypeAcc && option[pointType] != PointTypeAir && option[pointType] != PointTypeSta && option[pointType] != PointTypePor && option[pointType] != PointTypeZon">' +
                    '<li class="autocomplete-option" style="padding: 5px 17px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches" >' +
                       "<span>{{option[displayProperty]}}</span>" +
                    '</li>' +
                    '</span>' +
                    '</span>' +
                '</ul>' +
                '</div></div>' +
                '</div>' +
                '</div>',
            //'<span ng-if="selectedOption.Type == cityType" style="position: absolute;left: 16px;top: 71px;"><i class="soap-icon-hotel-2"></i></span> <span ng-if="selectedOption.Type == locationType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-map-marker" aria-hidden="true"></i></span> <span ng-if="selectedOption.Type == hotelType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-bed" aria-hidden="true"></i></span>',

            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '=',
                iconType: '@',
                cityType: '@',
                pointType: '@'
            },
            controller: function ($scope, TransferFactory) {

                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.cityType = "City";
                $scope.locationType = "Location";
                $scope.hotelType = "Hotel";
                $scope.PointTypeAcc = 'Accomodatiom';
                $scope.PointTypeAir = 'Airpors';
                $scope.PointTypeSta = 'Statiom';
                $scope.PointTypePor = 'Pors';
                $scope.PointTypeZon = 'Zond';
                $scope.PointTypeH = 'Accomodation';
                $scope.PointTypeA = 'Airport';
                $scope.PointTypeS = 'Station';

                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    if (term.length > 2) {
                        tjq("#pcityerror").html('');
                        if (document.getElementById('hdncitycode').value == null || document.getElementById('hdncitycode').value == "") {
                        //if (tjq('#hdncitycode').val() == null || tjq('#hdncitycode').val() == "") {
                            tjq("#pcityerror").html('You must select a pickup city');
                            return;
                        }
                    }

                    $scope.SearchTxt = term;
                    $scope.matchingOptions = [];
                    $scope.showOptions = true;
                    $scope.CityLoader = true;
                    if (term.length > 2) {


                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }

                        TransferFactory.GetPoints(term, document.getElementById('hdncitycode').value, document.getElementById('hdncountrycode').value).then(function (response) {
                            /// Add Accomodation for Heading  -- Accomodation to Accomodatiom for Sorting
                            var Accomodationfound = response.some(function (e) {
                                return e.PointType == 'Accomodation';
                            });
                            if (Accomodationfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Accomodatiom", "PointTypeCode": "H", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Accomodation", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Airport for Heading -- Airport to Airpors for Sorting
                            var Airportfound = response.some(function (e) {
                                return e.PointType == 'Airport';
                            });
                            if (Airportfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Airpors", "PointTypeCode": "A", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Airport", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Port for Heading -- Port to Pors for Sorting
                            var Portfound = response.some(function (e) {
                                return e.PointType == 'Port';
                            });
                            if (Portfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Pors", "PointTypeCode": "P", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Port", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Station for Heading -- Station to Statiom for Sorting
                            var Stationfound = response.some(function (e) {
                                return e.PointType == 'Station';
                            });
                            if (Stationfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Statiom", "PointTypeCode": "S", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Station", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Zone for Heading -- Zone to Zond for Sorting
                            var Zonefound = response.some(function (e) {
                                return e.PointType == 'Zone';
                            });
                            if (Zonefound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Zond", "PointTypeCode": "Z", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Zone", "ProviderCode": "", "Priority": 6 });
                            }

                            ///Sorting 
                            response.sort(function (a, b) {
                                return a.PointType == b.PointType ? 0 : a.PointType < b.PointType ? -1 : 1;
                            })


                            debugger;

                            //$scope.matchingOptions = response.CityResponse.Destinations.DestinationItems
                            $scope.matchingOptions = response;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }

                            $scope.showOptions = true;
                            if ($scope.matchingOptions.length == 0) {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                            }
                            else {
                                $scope.CityLoader = false;
                                $scope.hasMatches = false;
                            }
                        });

                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();
                    }


                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                        switch (e.which) {
                            case Keys.upArrow:
                                e.preventDefault();
                                if ($scope.showOptions) {
                                    $scope.highlightPrevious();
                                }
                                break;
                            case Keys.downArrow:
                                e.preventDefault();
                                if ($scope.showOptions) {
                                    $scope.highlightNext();
                                } else {
                                    $scope.showOptions = true;
                                    if ($scope.selectedOption) {
                                        $scope.highlightedOption = $scope.selectedOption;
                                    }
                                }
                                break;
                            case Keys.enter:
                                e.preventDefault();
                                if ($scope.highlightedOption) {
                                    $scope.selectOption($scope.highlightedOption);
                                } else {
                                    var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                    if (exactMatches[0]) {
                                        $scope.selectOption(exactMatches[0]);
                                    }
                                }
                                break;
                            case Keys.escape:
                                $scope.closeAndClear();
                                break;
                            case Keys.del:
                                $scope.clearSelectedSearch();
                            case Keys.backspace:
                                if ($scope.ngModel != '')
                                    $scope.clearSelectedSearch();

                                break;
                        }
                    }
                    else if (e.which >= 65 && e.which <= 90) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();



                    }
                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;  // hotel show/hide auto generate
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option, $scope.cityType);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null, $scope.cityType);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {

                //scope.render = function () {
                //    scope.$emit('searchTerm');
                //};
                //scope.render();

                //scope.$watch('searchTerm', function (newValue, oldValue) {
                //    if (!newValue || angular.equals(newValue, oldValue))
                //        return;
                //    scope.render();
                //})

                //scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                //scope.setOptionWidth = function () {
                //    // console.log(inputElement.offsetWidth);
                //    $timeout(function () {
                //        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                //        scope.optionWidth = pixelWidth + 'px';
                //    });
                //};

                //angular.element(document).ready(function () {
                //    scope.setOptionWidth();
                //});

                //angular.element($window).bind('resize', function () {
                //    scope.setOptionWidth();
                //});
            }
        };
    }])
    .directive('dtransferautocomplete', ['autocomplete-keys', '$window', '$timeout', function (Keys, $window, $timeout) {
        return {
            template: '<input autocomplete="off" style="padding-left: 34px;" type="text" onfocus="this.select();" class="form-control input-text full-width alignRight dctrf" placeholder="{{placeHolder}}"' +
                'ng-model="searchTerm"' +
                'ng-keydown="keyDown($event)"' +
                'ng-blur="onBlur()" />' +
                '<div class="autocomplete-arrow-up" ng-if="showOptions"></div>' +
                '<div class="autocomplete-options-container">' +
                '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                '<div class="" ng-if="CityLoader">' +
                '<span><div class="loading" style="right: 168px !important; top: 17px !important;"></div></span>' +
                '</div>' +
                '<div class="autocomplete-option" ng-if="hasMatches">' +
                '<span>No matches</span>' +
                '</div>' +
                '<div class="scrollbar" id="custom-scroll"><div class="force-overflow">' +
                '<ul class="autocomplete-options-list autocomplete-width" id="mylist">' +
                    '<span ng-repeat="option in matchingOptions"> ' +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeAcc'><i class='fa fa-bed' aria-hidden='true' style='font-size: 23px;vertical-align: bottom !important;'></i> Accomodation <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeAir'><i class='fa fa-plane landing-effect' aria-hidden='true'></i> Airport <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeSta'><i class='fa fa-train' aria-hidden='true'></i> Station <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypePor'><i class='fa fa-ship' aria-hidden='true'></i> Port <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    "<div class='trf_ACC_AIR' ng-if='option[pointType] == PointTypeZon'><i class='fa fa-map-marker' aria-hidden='true'></i> Zone <hr style='margin-top: 8px;margin-bottom: 8px;'/></div>" +
                    '<span ng-if="option[pointType] != PointTypeAcc && option[pointType] != PointTypeAir && option[pointType] != PointTypeSta && option[pointType] != PointTypePor && option[pointType] != PointTypeZon">' +
                    '<li class="autocomplete-option" style="padding: 5px 17px !important;" ng-class="{selected: isOptionSelected(option)}" ' + 'ng-style="{width: optionWidth}"' + 'ng-mouseenter="onOptionHover(option)"' + 'ng-mousedown="selectOption(option)"' + 'ng-if="!noMatches" >' +
                       "<span>{{option[displayProperty]}}</span>" +
                    '</li>' +
                    '</span>' +
                    '</span>' +
                '</ul>' +
                '</div></div>' +
                '</div>' +
                '</div>',
            //'<span ng-if="selectedOption.Type == cityType" style="position: absolute;left: 16px;top: 71px;"><i class="soap-icon-hotel-2"></i></span> <span ng-if="selectedOption.Type == locationType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-map-marker" aria-hidden="true"></i></span> <span ng-if="selectedOption.Type == hotelType" style="position: absolute;left: 16px;top: 71px;"><i class="fa fa-bed" aria-hidden="true"></i></span>',

            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@',
                ngModel: '=',
                iconType: '@',
                cityType: '@',
                pointType: '@'
            },
            controller: function ($scope, TransferFactory) {

                $scope.CityLoader = true;
                $scope.searchTerm = $scope.ngModel;
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;
                $scope.cityType = "City";
                $scope.locationType = "Location";
                $scope.hotelType = "Hotel";
                $scope.PointTypeAcc = 'Accomodatiom';
                $scope.PointTypeAir = 'Airpors';
                $scope.PointTypeSta = 'Statiom';
                $scope.PointTypePor = 'Pors';
                $scope.PointTypeZon = 'Zond';
                $scope.PointTypeH = 'Accomodation';
                $scope.PointTypeA = 'Airport';
                $scope.PointTypeS = 'Station';

                $scope.isOptionSelected = function (option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function (term) {
                    if (term.length > 2) {
                        //tjq("#dcityerror").html('');
                        //if (hdndcitycode.value == null || hdndcitycode.value == "") {
                        //    tjq("#dcityerror").html('You must select a dropoff city');
                        ////    return;
                        //}
                        // return;
                    }

                    $scope.SearchTxt = term;
                    $scope.matchingOptions = [];
                    $scope.showOptions = true;
                    $scope.CityLoader = true;
                    if (term.length > 2) {


                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            }
                            else {
                                $scope.closeAndClear();
                                return;
                            }
                        }
                        var citycode = "", countrycode = "";
                        if (document.getElementById('hdnisdifferentDropoffCity').value == "true")
                        {
                            citycode = document.getElementById('hdndcitycode').value;
                            countrycode = document.getElementById('hdndcountrycode').value;
                        }
                        else {
                            citycode = document.getElementById('hdncitycode').value;
                            countrycode = document.getElementById('hdncountrycode').value;
                        }
                        TransferFactory.GetPoints(term, citycode, countrycode).then(function (response) {
                            /// Add Accomodation for Heading  -- Accomodation to Accomodatiom for Sorting
                            var Accomodationfound = response.some(function (e) {
                                return e.PointType == 'Accomodation';
                            });
                            if (Accomodationfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Accomodatiom", "PointTypeCode": "H", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Accomodation", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Airport for Heading -- Airport to Airpors for Sorting
                            var Airportfound = response.some(function (e) {
                                return e.PointType == 'Airport';
                            });
                            if (Airportfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Airpors", "PointTypeCode": "A", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Airport", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Port for Heading -- Port to Pors for Sorting
                            var Portfound = response.some(function (e) {
                                return e.PointType == 'Port';
                            });
                            if (Portfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Pors", "PointTypeCode": "P", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Port", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Station for Heading -- Station to Statiom for Sorting
                            var Stationfound = response.some(function (e) {
                                return e.PointType == 'Station';
                            });
                            if (Stationfound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Statiom", "PointTypeCode": "S", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Station", "ProviderCode": "", "Priority": 6 });
                            }

                            /// Add Zone for Heading -- Zone to Zond for Sorting
                            var Zonefound = response.some(function (e) {
                                return e.PointType == 'Zone';
                            });
                            if (Zonefound) {
                                response.push({ "PointName": "", "PointCode": "", "PointType": "Zond", "PointTypeCode": "Z", "CityName": "", "CityCode": "", "CountryName": "", "CountryCode": "", "DisplayName": "Zone", "ProviderCode": "", "Priority": 6 });
                            }

                            ///Sorting 
                            response.sort(function (a, b) {
                                return a.PointType == b.PointType ? 0 : a.PointType < b.PointType ? -1 : 1;
                            })



                            //$scope.matchingOptions = response.CityResponse.Destinations.DestinationItems
                            $scope.matchingOptions = response;
                            if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                                $scope.clearHighlight();
                            }

                            $scope.showOptions = true;
                            if ($scope.matchingOptions.length == 0) {
                                $scope.hasMatches = true;
                                $scope.CityLoader = false;
                            }
                            else {
                                $scope.CityLoader = false;
                                $scope.hasMatches = false;
                            }
                        });

                    } else {
                        $scope.CityLoader = false;
                        $scope.hasMatches = false;
                        $scope.closeAndClear();
                    }


                };

                $scope.findMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function (term) {
                    return $scope.options.filter(function (option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function (e) {
                    if (e.which == Keys.upArrow || e.which == Keys.downArrow || e.which == Keys.enter || e.which == Keys.escape || e.which == Keys.del || e.which == Keys.backspace) {
                        switch (e.which) {
                            case Keys.upArrow:
                                e.preventDefault();
                                if ($scope.showOptions) {
                                    $scope.highlightPrevious();
                                }
                                break;
                            case Keys.downArrow:
                                e.preventDefault();
                                if ($scope.showOptions) {
                                    $scope.highlightNext();
                                } else {
                                    $scope.showOptions = true;
                                    if ($scope.selectedOption) {
                                        $scope.highlightedOption = $scope.selectedOption;
                                    }
                                }
                                break;
                            case Keys.enter:
                                e.preventDefault();
                                if ($scope.highlightedOption) {
                                    $scope.selectOption($scope.highlightedOption);
                                } else {
                                    var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                    if (exactMatches[0]) {
                                        $scope.selectOption(exactMatches[0]);
                                    }
                                }
                                break;
                            case Keys.escape:
                                $scope.closeAndClear();
                                break;
                            case Keys.del:
                                $scope.clearSelectedSearch();
                            case Keys.backspace:
                                if ($scope.ngModel != '')
                                    $scope.clearSelectedSearch();

                                break;
                        }
                    }
                    else if (e.which >= 65 && e.which <= 90) {
                        if ($scope.ngModel != '')
                            $scope.clearSelectedSearch();



                    }
                };

                $scope.$watch('searchTerm', function (term) {
                    if ($scope.ngModel != '') {
                        $scope.searchTerm = $scope.ngModel;
                    }
                    else {
                        $scope.processSearchTerm(term);
                    }
                });

                $scope.highlightNext = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function () {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function (option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('ng-autocomplete:clearInput', function () {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function () {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function () {
                    $scope.showOptions = false;  // hotel show/hide auto generate
                    $scope.clearHighlight();
                };

                $scope.selectOption = function (option) {

                    $scope.selectedOption = option;

                    //this is on searchcontroller
                    $scope.onSelect(option, $scope.cityType);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false')
                        $scope.searchTerm = '';
                    else
                        $scope.searchTerm = option[$scope.displayProperty];

                    $scope.closeAndClear();
                };

                $scope.clearSelectedSearch = function () {
                    $scope.selectedOption = null;
                    $scope.searchTerm = '';
                    $scope.onSelect(null, $scope.cityType);
                }

                $scope.onBlur = function () {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function () {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function (scope, elem, attrs) {

                //scope.render = function () {
                //    scope.$emit('searchTerm');
                //};
                //scope.render();

                //scope.$watch('searchTerm', function (newValue, oldValue) {
                //    if (!newValue || angular.equals(newValue, oldValue))
                //        return;
                //    scope.render();
                //})

                //scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                //scope.setOptionWidth = function () {
                //    // console.log(inputElement.offsetWidth);
                //    $timeout(function () {
                //        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                //        scope.optionWidth = pixelWidth + 'px';
                //    });
                //};

                //angular.element(document).ready(function () {
                //    scope.setOptionWidth();
                //});

                //angular.element($window).bind('resize', function () {
                //    scope.setOptionWidth();
                //});
            }
        };
    }])


    //





    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('tmpl/rangeSpinner.html',
            '<div class="input-group number-spinner">\
                     <span class="input-group-btn"><a class="btn btn-default btn-info minuscls" href="javascript:void(0)" ng-click="rangeMinusFunc()"><i class="fa fa-minus" aria-hidden="true"></i></a></span>\
            <input name="{{nameOfField}}" readonly id="{{idOfField}}" type="text" class="form-control text-center" ng-subindex="{{spinnerOfSubindex}}" ng-type="{{spinnerOfType}}" ng-index="{{spinerOfIndex}}" ng-model="rangeModel" range-min="{{rangeMin}}" range-step="{{rangeStep}}" range-max="{{rangeMax}}" ng-model="rangeModel" parentModel={{parentModel}} required>\
            <span class="input-group-btn"><a class="btn btn-default btn-info pluscls" href="javascript:void(0)" ng-click="rangePlusFunc()"><i class="fa fa-plus" aria-hidden="true"></i></a></span>\
              </div>\
        ');
    }])


     .directive('jcarouselsliderresult', ['$filter',
    function ($filter) {
        return {
            restrict: "A",
            scope: { packagecategorylist: '=', currency: '=', roe: "=" },
            template: '<div id="resultcategoryslider" class="jcarousel"><ul><li ng-repeat="(k, packagecat) in packagecategorylist"> <div class="col-xs-12 col-sm-12 col-md-12">' +
                        '<div class="itineraries-box">' +
                            '<div class="overlay_all">' +
                                '<div class="overlay_inner"></div>' +
                                '<a href="' + document.getElementById("hdnUrlPath").value + '?packageid={{packagecat.PackageId}}">' +
                                    '<button class="Select_package">Customize package</button>' +
                                '</a>' +
                            '</div>' +

                            '<div class="itineraries-image"><img class="img-responsive-custom1 img-responsive-custom1_xs hotel-result-img" ng-src="' + document.getElementById("hdnImgPath").value + 'Packages/{{packagecat.PackageImage[0].PkgThumbImgName}}" alt="" on-error-src="' + document.getElementById("hdnImgPath").value + 'not_avil.jpg" />' +
                            '<div class="offer-ribbon" ng-if="packagecat.PkgStrikethroughAmt * roe - packagecat.Price * roe>=1">' +
                            '<a href="JavaScript:Void(0);" style="color: inherit;">' +
                            '<div class="offer-info">Save up to <br /> <span class="the-offer">{{currency}} {{packagecat.PkgStrikethroughAmt * roe - packagecat.Price * roe | number : 2}}</span></div>' +
                            '</a> </div>' +
                            '</div>' +
                            '<div class="itineraries-text"><h5 class="pkg-cat-heading">{{packagecat.PackageName}} </h5><h5>{{packagecat.PackageDurationValue}} N / {{totaldays(packagecat.PackageDurationValue)}} D</h5><p class="ng-binding">{{packagecat.PackageShortdesc | limitTo : 50}}{{packagecat.PackageShortdesc.length > 50 ? "..." : ""}} </p></div>' +
                            '<div class="border-bottom-dashed" style="border-top:1px dashed #ccc;"><div class="itineraries-text"><div class="pull-left" ng-if="packagecat.ServicesIncluded != null"><p class="padding-top-10">Services</p></div>' +

                                    "<div class='pull-right'><div class='service_icons_result'>" +
                                    "<div ng-repeat='service in splitme(packagecat.ServicesIncluded)'>" +
                                                '<i class="fa fa-plane" aria-hidden="true" ng-if="service == \'AIR\'" title="Flights"></i><i class="fa fa-bed" aria-hidden="true" ng-if="service == \'HTL\'" title="Hotels"></i><i class="fa fa-car" aria-hidden="true" ng-if="service == \'TRF\'" title="Transfers"></i><i class="fa fa-car" aria-hidden="true" ng-if="service == \'CAR\'" title="Cars"></i><i class="fa fa-umbrella" aria-hidden="true" ng-if="service == \'SSG\'" title="Activities"></i>' +
                                                 //'<span ><i class="fa fa-plane" aria-hidden="true"  title="Flights" ng-if="service == \'AIR\'"></i></span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="clearfix"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="border-bottom-dashed" style="border-top:1px dashed #ccc;">' +
                            //'<a href="/Home/Cart/ViewPackageDetails?packageid=144"><small class="font-13 compileScope">FROM {{currency}}  </small> {{packagecat.Price * roe | number : 2}}</a>' +
                            '<a ng-if="packagecat.PkgStrikethroughAmt * roe - packagecat.Price * roe>=1" href="/Home/Cart/ViewPackageDetails?packageid=144"><strike class="font-13"><small>FROM {{currency}}</small>{{packagecat.PkgStrikethroughAmt * roe | number : 2}}</strike> &nbsp;<small class="font-13">FROM {{currency}}  </small> {{packagecat.Price * roe | number : 2}}</a>' +
                            '<a ng-if="packagecat.PkgStrikethroughAmt * roe - packagecat.Price * roe<=1" href="/Home/Cart/ViewPackageDetails?packageid=144"><small class="font-13">FROM {{currency}}  </small> {{packagecat.Price * roe | number : 2}}</a>' +
                            '</div>' +
                            '<div class="clearfix"></div>' +
                    '</div></li></ul></div>' +
                    '<a href="javascript:void(0)" class="jcarousel-control-prev" data-jcarouselcontrol="true">‹</a>' +
                    '<a href="javascript:void(0)" class="jcarousel-control-next" data-jcarouselcontrol="true">›</a>',
            link: function (scope, elem, attr, ctrl) {
                scope.splitme = function (service) {
	var array = null;
		if(service != null)
		{
		   var array = service;
                    if (array != "undefined") {
                        array = service.split(',');
                    }
                   
		}
		return array;

                };
                scope.totaldays = function (nights) {
                    var days = "";
                    days = parseInt(nights) + 1
                    return days;
                };


                scope.$watch('packagecategorylist', function (packagecategorylist) {
                    if (packagecategorylist != undefined) {
                        if (packagecategorylist.length) {

                        }
                    }

                });
            }
        };
    }]
  )

    .directive('jcarouselsliderhomefirst', ['$filter',
    function ($filter) {
        return {
            restrict: "A",
            scope: { packagecategorylisthomefirst: '=', currency: '=', roe: "=" },
            template: '<div id="FirstPreferedPkgSlider" class="jcarousel" data-jcarousel="true"><ul><li ng-repeat="(k, firstpreferedpkg) in packagecategorylisthomefirst"> <div class="col-xs-12 col-sm-12 col-md-12">' +
                        '<div class="itineraries-box height-img">' +
                            '<div class="overlay_all">' +
                                '<div class="overlay_inner"></div>' +
                                '<a href="' + document.getElementById("hdnUrlPath").value + '?packageid={{firstpreferedpkg.PackageId}}">' +
                                    '<button class="Select_package3">Customize package</button>' +
                                '</a>' +
                            '</div>' +

                            '<div class="itineraries-image"><img class="img-responsive-custom1 img-responsive-custom1_xs hotel-result-img" ng-src="' + document.getElementById("hdnImgPath").value + 'Packages/{{firstpreferedpkg.PackageImage[0].PkgThumbImgName}}" alt="" on-error-src="' + document.getElementById("hdnImgPath").value + 'not_avil.jpg" />' +
                            '<div class="offer-ribbon" ng-if="firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe>=1">' +
                            '<a href="JavaScript:Void(0);" style="color: inherit;">' +
                            '<div class="offer-info">Save up to <br /> <span class="the-offer">{{currency}} {{firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe | number : 2}}</span></div>' +
                            '</a> </div>' +
                            '</div>' +
                            '<div class="itineraries-text"><h5 class="pkg-cat-heading">{{firstpreferedpkg.PackageName}} </h5><h5>{{firstpreferedpkg.PackageDurationValue}} N / {{totaldays(firstpreferedpkg.PackageDurationValue)}} D</h5><p class="ng-binding">{{firstpreferedpkg.PackageShortdesc | limitTo : 100}}{{firstpreferedpkg.PackageShortdesc.length > 100 ? "..." : ""}} </p></div>' +
                            '<div ng-if="firstpreferedpkg.ServicesIncluded != null" class="border-bottom-dashed" style="border-top:1px dashed #ccc;"><div class="itineraries-text"><div class="pull-left"><p class="padding-top-10">Services</p></div>' +

                                    "<div class='pull-right service_icons_result'><div class='service_icons_result'>" +
                                    "<div ng-repeat='service in splitme(firstpreferedpkg.ServicesIncluded)'>" +
                                                '<i class="fa fa-plane" aria-hidden="true" ng-if="service == \'AIR\'" title="Flights"></i><i class="fa fa-bed" aria-hidden="true" ng-if="service == \'HTL\'" title="Hotels"></i><i class="fa fa-car" aria-hidden="true" ng-if="service == \'TRF\'" title="Transfers"></i><i class="fa fa-car" aria-hidden="true" ng-if="service == \'CAR\'" title="Cars"></i><i class="fa fa-umbrella" aria-hidden="true" ng-if="service == \'SSG\'" title="Activities"></i>' +
                                                 //'<span ><i class="fa fa-plane" aria-hidden="true"  title="Flights" ng-if="service == \'AIR\'"></i></span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="clearfix"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="border-bottom-dashed" style="border-top:1px dashed #ccc;">' +
                            '<a ng-if="firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe>=1" href="/Home/Cart/ViewPackageDetails?packageid=144"><strike class="font-13"><small>FROM {{currency}}</small>{{firstpreferedpkg.PkgStrikethroughAmt * roe | number : 2}}</strike> &nbsp;<small class="font-13">FROM {{currency}}  </small> {{firstpreferedpkg.Price * roe | number : 2}}</a>' +
                            '<a ng-if="firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe<=1" href="/Home/Cart/ViewPackageDetails?packageid=144"><small class="font-13">FROM {{currency}}  </small> {{firstpreferedpkg.Price * roe | number : 2}}</a>' +
                            //'<a href="javascript:void(0)"><small class="font-13 compileScope">FROM {{currency}}  </small> {{firstpreferedpkg.Price * roe | number : 2}}</a>'+
                            '</div>' +
                            '<div class="clearfix"></div>' +
                    '</div></li></ul></div>' +
                    '<a href="javascript:void(0)" class="jcarousel-control-prev" data-jcarouselcontrol="true">‹</a>' +
                    '<a href="javascript:void(0)" class="jcarousel-control-next" data-jcarouselcontrol="true">›</a>',
            link: function (scope, elem, attr, ctrl) {
                scope.splitme = function (service) {
                   	var array = null;
		if(service != null)
		{
		   var array = service;
                    if (array != "undefined") {
                        array = service.split(',');
                    }
                   
		}
		return array;                };
                scope.totaldays = function (nights) {
                    var days = "";
                    days = parseInt(nights) + 1
                    return days;
                };


                scope.$watch('packagecategorylisthomefirst', function (packagecategorylisthomefirst) {
                    if (packagecategorylisthomefirst != undefined) {
                        if (packagecategorylisthomefirst.length) {

                        }
                    }

                });
            }
        };
    }]
  )

    .directive('jcarouselsliderhomesecond', ['$filter',
    function ($filter) {
        return {
            restrict: "A",
            scope: { packagecategorylisthomesecond: '=', currency: '=', roe: "=" },
            template: '<div id="SecondPreferedPkgSlider" class="jcarousel" data-jcarousel="true"><ul><li ng-repeat="(k, firstpreferedpkg) in packagecategorylisthomesecond"> <div class="col-xs-12 col-sm-12 col-md-12">' +
                        '<div class="itineraries-box height-img">' +
                            '<div class="overlay_all">' +
                                '<div class="overlay_inner"></div>' +
                                '<a href="' + document.getElementById("hdnUrlPath").value + '?packageid={{firstpreferedpkg.PackageId}}">' +
                                    '<button class="Select_package3">Customize package</button>' +
                                '</a>' +
                            '</div>' +

                            '<div class="itineraries-image"><img class="img-responsive-custom1 img-responsive-custom1_xs hotel-result-img" ng-src="' + document.getElementById("hdnImgPath").value + 'Packages/{{firstpreferedpkg.PackageImage[0].PkgThumbImgName}}" alt="" on-error-src="' + document.getElementById("hdnImgPath").value + 'not_avil.jpg" />' +
                            '<div class="offer-ribbon" ng-if="firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe>=1">' +
                            '<a href="JavaScript:Void(0);" style="color: inherit;">' +
                            '<div class="offer-info">Save up to <br /> <span class="the-offer">{{currency}} {{firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe | number : 2}}</span></div>' +
                            '</a> </div>' +
                            '</div>' +
                            '<div class="itineraries-text"><h5 class="pkg-cat-heading">{{firstpreferedpkg.PackageName}} </h5><h5>{{firstpreferedpkg.PackageDurationValue}} N / {{totaldays(firstpreferedpkg.PackageDurationValue)}} D</h5><p class="ng-binding">{{firstpreferedpkg.PackageShortdesc | limitTo : 100}}{{firstpreferedpkg.PackageShortdesc.length > 100 ? "..." : ""}} </p></div>' +
                            '<div ng-if="firstpreferedpkg.ServicesIncluded != null" class="border-bottom-dashed" style="border-top:1px dashed #ccc;"><div class="itineraries-text"><div class="pull-left"><p class="padding-top-10">Services</p></div>' +

                                    "<div class='pull-right service_icons_result'><div class='service_icons_result'>" +
                                    "<div ng-repeat='service in splitme(firstpreferedpkg.ServicesIncluded)'>" +
                                                '<i class="fa fa-plane" aria-hidden="true" ng-if="service == \'AIR\'" title="Flights"></i><i class="fa fa-bed" aria-hidden="true" ng-if="service == \'HTL\'" title="Hotels"></i><i class="fa fa-car" aria-hidden="true" ng-if="service == \'TRF\'" title="Transfers"></i><i class="fa fa-car" aria-hidden="true" ng-if="service == \'CAR\'" title="Cars"></i><i class="fa fa-umbrella" aria-hidden="true" ng-if="service == \'SSG\'" title="Activities"></i>' +
                                                 //'<span ><i class="fa fa-plane" aria-hidden="true"  title="Flights" ng-if="service == \'AIR\'"></i></span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="clearfix"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="border-bottom-dashed" style="border-top:1px dashed #ccc;">' +

                            //'<a href="javascript:void(0)"><small class="font-13 compileScope">FROM {{currency}}  </small> {{firstpreferedpkg.Price * roe | number : 2}}</a>' +

                            '<a ng-if="firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe>=1" href="/Home/Cart/ViewPackageDetails?packageid=144"><strike class="font-13"><small>FROM {{currency}}</small>{{firstpreferedpkg.PkgStrikethroughAmt * roe | number : 2}}</strike> &nbsp;<small class="font-13">FROM {{currency}}  </small> {{firstpreferedpkg.Price * roe | number : 2}}</a>' +
                            '<a ng-if="firstpreferedpkg.PkgStrikethroughAmt * roe - firstpreferedpkg.Price * roe<=1" href="/Home/Cart/ViewPackageDetails?packageid=144"><small class="font-13">FROM {{currency}}  </small> {{firstpreferedpkg.Price * roe | number : 2}}</a>' +

                            '</div>' +
                            '<div class="clearfix"></div>' +
                    '</div></li></ul></div>' +
                    '<a href="javascript:void(0)" class="jcarousel-control-prev" data-jcarouselcontrol="true">‹</a>' +
                    '<a href="javascript:void(0)" class="jcarousel-control-next" data-jcarouselcontrol="true">›</a>',
            link: function (scope, elem, attr, ctrl) {
                scope.splitme = function (service) {
                   	var array = null;
		if(service != null)
		{
		   var array = service;
                    if (array != "undefined") {
                        array = service.split(',');
                    }
                   
		}
		return array;                };
                scope.totaldays = function (nights) {
                    var days = "";
                    days = parseInt(nights) + 1
                    return days;
                };


                scope.$watch('packagecategorylisthomesecond', function (packagecategorylisthomesecond) {
                    if (packagecategorylisthomesecond != undefined) {
                        if (packagecategorylisthomesecond.length) {

                        }
                    }

                });
            }
        };
    }]
  )

.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
function FindDate(DateIn) {
    DateIn = DateIn + '';
    if (DateIn.length == 1)
        return "0" + DateIn;
    else
        return DateIn;
}

function dateformatt(date) {
    var xvals = date.replace(/[^\x20-\x7E]/g, '').split("-");
    var date2 = new Date(
    parseInt(xvals[2]),
    parseInt(getPropertymonth(xvals[1])),
    parseInt(xvals[0])
);
    return date2;
}

var monthnew = { "Jan": "00", "Feb": "01", "Mar": "02", "Apr": "03", "May": "04", "Jun": "05", "Jul": "06", "Aug": "07", "Sep": "08", "Oct": "09", "Nov": "10", "Dec": "11" };
var getPropertymonth = function (propertyName) {
    return monthnew[propertyName];
};

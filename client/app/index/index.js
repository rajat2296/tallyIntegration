'use strict';

angular.module('tallyprojectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/index',
        templateUrl: 'app/index/index.html',
        controller: 'IndexCtrl',
        authenticate:true
      });
  });

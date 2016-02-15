'use strict';

angular.module('tallyprojectApp')
  .controller('IndexCtrl', function ($scope,$http,blockUI) {
    $scope.tally = {};


 $scope.addLedger=function() {
   blockUI.start();
   $scope.message = {
     data: "<ENVELOPE>" +
     "<HEADER>" +
     "<VERSION>1</VERSION>" +
     "<TALLYREQUEST>Import</TALLYREQUEST>" +
     "<TYPE>Data</TYPE>" +
     "<ID>All Masters</ID>" +
     "</HEADER>" +
     "<BODY>" +
     "<DESC>" +
     "<STATICVARIABLES>" +
     "<IMPORTDUPS>@@DUPCOMBINE</IMPORTDUPS>" +
     "</STATICVARIABLES>" +
     "</DESC>" +
     "<DATA>" +

     "<TALLYMESSAGE>" +
     "<GROUP NAME="+"\'" +$scope.tally.name+"\'"+" Action = 'Create'>" +
     " <NAME>" + $scope.tally.name + "</NAME>" +
     "</GROUP>" +
     "<LEDGER NAME="+"\'" +$scope.tally.name+"\'"+" Action = 'Create'>" +
     " <NAME>" + $scope.tally.name + "</NAME>" +
      " <PARENT>"+$scope.tally.name+"</PARENT>" +
     "</LEDGER>" +
   /*<PARENT>Sundry Debtors</PARENT>*/
     "</TALLYMESSAGE>" +
     "</DATA>" +
     "</BODY>" +
     "</ENVELOPE>"
   }

   $http({
     method: 'POST',
     url: '/api/data/',
     data: $scope.message,
   }).success(function (data) {
     console.log(data);
     alert('your response was successfully submitted');
   }).error(function (data) {
     console.log(data);
   });
   blockUI.stop();
 }

    $scope.reports=function() {

      $scope.message2 = {
        data:"<ENVELOPE>"+
        "<HEADER>"+
        "<VERSION>1</VERSION>"+
        "<TALLYREQUEST>Export</TALLYREQUEST>"+
        "<TYPE>Data</TYPE>"+
        "<ID>Day Book</ID>"+
        "</HEADER>"+
        "<BODY>"+
        "<DESC>"+
        "<STATICVARIABLES>"+
        "<EXPLODEFLAG>Yes</EXPLODEFLAG>"+
        "<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>"+
      "</STATICVARIABLES>"+
      "</DESC>"+
      "</BODY>"+
      "</ENVELOPE> "
      }

      $http({
        method: 'POST',
        url: '/api/data/reports',
        data: $scope.message2,
      }).success(function (data) {
        console.log(data);
        alert('your response was successfully submitted');
      }).error(function (data) {
        console.log(data);
      });
    }

});


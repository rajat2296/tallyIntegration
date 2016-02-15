'use strict';

angular.module('tallyprojectApp')
  .controller('MainCtrl', function ($scope, $http, socket,$timeout) {
    $scope.flag=0;
    $scope.created = 0;
    $scope.connectflag = 0;
    $scope.progressflag = false;
    $scope.progressvalue = 0;
    $scope.progressV = 0;
     $scope.hosturl="http://localhost:9000";
   // $scope.form.startDate=new Date('April 1,2015');
   // $scope.form.endDate=new Date('April 1,2015');
    // $scope.form.option="all";

    $scope.tally = [
      {date: new Date('April 1, 2015'), invoiceNo: 1, billing: [{ledgername: 'sales', amount: 500}]},
      {
        date: new Date('April 1, 2015'),
        invoiceNo: 2,
        billing: [{ledgername: 'sales', amount: 500}, {ledgername: 'service charge', amount: 50.7}]
      },
      {
        date: new Date('April 1, 2015'),
        invoiceNo: 3,
        billing: [{ledgername: 'sales', amount: 500}, {ledgername: 'service charge', amount: 50.25}, {
          ledgername: 'vat',
          amount: 25
        }]
      },
      {
        date: new Date('April 1, 2015'),
        invoiceNo: 4,
        billing: [{ledgername: 'sales', amount: 1000}, {ledgername: 'sales tax', amount: 40}, {
          ledgername: 'custom tax',
          amount: 30
        }, {ledgername: 'vat@5%', amount: 50}]
      },
      {
        date: new Date('April 2, 2015'),
        invoiceNo: 5,
        billing: [{ledgername: 'sales', amount: 500}, {ledgername: 'service charge', amount: 50}, {
          ledgername: 'vat',
          amount: 25
        }]
      },
      {
        date: new Date('April 2, 2015'),
        invoiceNo: 6,
        billing: [{ledgername: 'purchase', amount: 500}, {ledgername: 'service charge', amount: 50}, {
          ledgername: 'vat',
          amount: 25
        }]
      },
      {
        date: new Date('April 3, 2015'),
        invoiceNo: 7,
        billing: [{ledgername: 'purchase', amount: 500}, {ledgername: 'service charge', amount: 50}, {
          ledgername: 'vat',
          amount: 25
        }]
      },
      {
        date: new Date('April 4, 2015'),
        invoiceNo: 8,
        billing: [{ledgername: 'purchase', amount: 500}, {ledgername: 'service charge', amount: 50}, {
          ledgername: 'vat',
          amount: 25
        }]
      }
    ];

    $scope.tallypush = [];
    $scope.form = {};

  for (var i = 9; i <= 100; i++) {

    var sample = {
      date: new Date('April 1, 2015'),
      invoiceNo: i,
      billing: [{ledgername: 'purchase', amount: 500}, {ledgername: 'service charge', amount: 50.3}, {
        ledgername: 'vat',
        amount: 25
      }]
    };
    $scope.tally.push(sample);
  }


    $scope.connect = function () {
      var message = {
        data: "<ENVELOPE></ENVELOPE>",
        url: $scope.hosturl
      };

      $http({
        method: 'POST',
        url: '/api/data/connect',
        data: message
      }).success(function (data) {
        console.log(data);
        console.log("tallyconnect");
        $scope.connectflag = 1;
      }).error(function (data) {
        console.log(data);
        console.log("error");
        $scope.connectflag = -1;
      });
    };

    $scope.addLedger = function () {

      $scope.progressflag=true;

      console.log($scope.tally.length);

      for (var i = 0; i < $scope.tally.length; i++) {
        //console.log($scope.form.option == 'Selected Invoice' && $scope.tally[i].invoiceNo>=$scope.form.invoicefrom);
        if ($scope.tally[i].date >= $scope.form.startDate && $scope.tally[i].date <= $scope.form.endDate) {
          if ($scope.form.option == 'all') {
            $scope.tallypush.push($scope.tally[i]);
          }
          else if ($scope.form.option == 'Selected Invoice' && $scope.tally[i].invoiceNo >= $scope.form.invoicefrom && $scope.tally[i].invoiceNo <= $scope.form.invoiceto) {
            $scope.tallypush.push($scope.tally[i]);
          }
        }

      }

      console.log("out");

      var ledgerxml = "";
      var voucherxml = "";
      var vouchercount=0;

      console.log($scope.tallypush.length);

      for (var i = 0; i < $scope.tallypush.length; ) {

        ledgerxml="";
        voucherxml="";
        vouchercount=0;

        while(vouchercount<20 && i<$scope.tallypush.length) {
          console.log("bakk");

          vouchercount++;
          var grandtotal = 0;


          ledgerxml += "<ENVELOPE>" +
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
            "<TALLYMESSAGE>";

          var date = "";
          date += $scope.tallypush[i].date.getFullYear();
          var month = $scope.tallypush[i].date.getMonth() + 1;
          if (month < 10) {
            date += 0;
            date += month;
          }
          else {
            date += month;
          }
          var day = $scope.tallypush[i].date.getDate();
          if (day < 10) {
            date += 0;
            date += day;
          }
          else {
            date += day;
          }

          voucherxml += "<ENVELOPE> <HEADER>		<VERSION>1</VERSION>		<TALLYREQUEST>Import</TALLYREQUEST>		<TYPE>Data</TYPE>		<ID>Vouchers</ID>	</HEADER> <BODY><DESC></DESC><DATA><TALLYMESSAGE>";
          voucherxml += "<VOUCHER><DATE>" + date + "</DATE><VOUCHERTYPENAME>Receipt</VOUCHERTYPENAME><VOUCHERNUMBER>1</VOUCHERNUMBER>";

          for (var j = 0; j < $scope.tallypush[i].billing.length; j++) {

            ledgerxml += "<GROUP NAME=" + "\'" + $scope.tallypush[i].billing[j].ledgername + "\'" + " Action = 'Create'>" +
              " <NAME>" + $scope.tallypush[i].billing[j].ledgername + "</NAME>" +
              "</GROUP>" +
              "<LEDGER NAME=" + "\'" + $scope.tallypush[i].billing[j].ledgername + "\'" + " Action = 'Create'>" +
              " <NAME>" + $scope.tallypush[i].billing[j].ledgername + "</NAME>" +
              " <PARENT>" + $scope.tallypush[i].billing[j].ledgername + "</PARENT>" +
              "</LEDGER>";

            grandtotal += $scope.tallypush[i].billing[j].amount;
            voucherxml += "<ALLLEDGERENTRIES.LIST>" +
              "<LEDGERNAME>" + $scope.tallypush[i].billing[j].ledgername + "</LEDGERNAME>" +
              "<ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>" +
              "<AMOUNT>" + $scope.tallypush[i].billing[j].amount + "</AMOUNT>" +
              "</ALLLEDGERENTRIES.LIST>";
          }

          ledgerxml += "<GROUP NAME='round off' action='create'><NAME>round off</NAME></GROUP><LEDGER name='round off' action='create'><NAME>round off</NAME><PARENT>round off</PARENT></LEDGER>"

          ledgerxml += "</TALLYMESSAGE>" +
            "</DATA>" +
            "</BODY>" +
            "</ENVELOPE>";

          var roundoff = parseFloat((Math.round(grandtotal) - grandtotal)).toFixed(2);

          voucherxml += "<ALLLEDGERENTRIES.LIST>" +
            "<LEDGERNAME>round off</LEDGERNAME>";

          if (roundoff >= 0) {
            voucherxml += "<ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>";
          }
          else {
            voucherxml += "<ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>";
          }

          voucherxml += "<AMOUNT>" + roundoff + "</AMOUNT>" +
            "</ALLLEDGERENTRIES.LIST>";

          voucherxml += "<ALLLEDGERENTRIES.LIST>" +
            "<LEDGERNAME>Cash</LEDGERNAME>" +
            "<ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>" +
            "<AMOUNT>-" + (grandtotal + Number(roundoff)) + "</AMOUNT>" +
            "</ALLLEDGERENTRIES.LIST>" +
            "</VOUCHER>" +
            "</TALLYMESSAGE>" +
            "</DATA>" +
            "</BODY>" +
            "</ENVELOPE>";


          console.log("ledger");
          //console.log(ledgerxml);
          i++;
        }

        var message={
          url:$scope.hosturl,
          data:ledgerxml+voucherxml
        };

        $scope.created+=vouchercount;

        console.log('vouchercount:'+vouchercount);


          $http({
            method: 'POST',
            url: '/api/data/',
            data: message
          }).success(function (data) {
              console.log("success");
            // console.log("progress:" +vouchercount);
            $scope.progressvalue = Math.min(((($scope.progressV += 20) * 100) / $scope.tallypush.length),100);
              if ($scope.progressvalue >= 100) {
                $timeout(function() {
                  $scope.progressflag = false;
                  $scope.flag=1;
                  $scope.progressvalue = 0;
                  $scope.progressV = 0;
                  console.log("hiiiiii");
                },1000);
              }
            }
          ).error(function (data) {
            console.log(data);
            $scope.progressflag=false;
          });

      }
  }

  });

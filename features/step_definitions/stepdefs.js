const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

function isItFriday(today) {
   if (today === "Friday"){
       return "TGIF";
   } else {
       return "Nope";
   }
  }

Given('today is {string}', function (givenDay) {
    this.today = givenDay;
  });

  When('I ask whether it\'s Friday yet', function () {
    this.actualAnswer = isItFriday(this.today);
  });

  Then('I should be told {string}',  function (expectedAnswer) {
    assert.strictEqual(this.actualAnswer, expectedAnswer);
  });

  function replicatorTest(order) {
    if (order === "Earl Grey Hot"){
        return "a hot cup of tea";
    } else {
        return "a pasta bowl";
    }
   }
 
 Given('I say {string}', function (givenOrder) {
     this.order = givenOrder;
   });
 
   When('I check the replicator', function () {
     this.actualProduct = replicatorTest(this.order);
   });
 
   Then('I should see {string}',  function (product) {
     assert.strictEqual(this.actualProduct, product);
   });
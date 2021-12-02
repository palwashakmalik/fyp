var Drugpurchase = artifacts.require("Drugpurchase");

module.exports = function(deployer) {
  deployer.deploy(Drugpurchase);
};
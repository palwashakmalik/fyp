pragma solidity ^0.5.0;

contract Drugpurchase {
address[16] public manufacturer;

function buydrug(uint Id) public returns (uint) {
  require(Id >= 0 && Id <= 15);

  manufacturer[Id] = msg.sender;

  return Id;
}
function getdrugbuyers() public view returns (address[16] memory) {
  return manufacturer;
}
}
pragma solidity ^0.8.0;
contract Storage {
     uint number;
function store(uint num) public {
         number = num;
     }
function retrieve() public view returns (uint){
         return number;
      }
}

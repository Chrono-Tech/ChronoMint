pragma solidity ^0.4.4;

import "Managed.sol";

contract Configurable {
  mapping(string => uint) internal settings;

  function getVal(string name) constant returns(uint) {
    return settings[name];
  }

  function setVal(string name, uint value) internal {
    settings[name] = value;
  }
}

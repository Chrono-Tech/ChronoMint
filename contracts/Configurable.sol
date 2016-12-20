pragma solidity ^0.4.4;

contract Configurable {
  mapping(string => uint) internal settings;
  mapping(string => string) internal stringSettings;

  function getVal(string name) constant returns(uint) {
    return settings[name];
  }

  function setVal(string name, uint value) internal {
    settings[name] = value;
  }

  function getStr(string name) constant returns(string) {
    return stringSettings[name];
  }

  function setStr(string name, string value) internal {
    stringSettings[name] = value;
  }


}

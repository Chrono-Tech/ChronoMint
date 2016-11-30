pragma solidity ^0.4.4;

contract Owned {
    mapping(address => bool) public contractOwners;
    mapping(address => bool) public pendingContractOwners;

    function Owned() {
        contractOwners[msg.sender] = true;
    }

    modifier onlyOwner() {
        if (isOwner( msg.sender)) {
            _;
        }
        else
        {
          throw;
        }
    }

    function addContractOwner(address _to) onlyOwner() returns(bool) {
        if (contractOwners[_to] != true)
        pendingContractOwners[_to] = true;
        return true;
    }

    function claimContractOwnership() returns(bool) {
        if (pendingContractOwners[msg.sender] != true) {
            return false;
        }
        contractOwners[msg.sender] = true;
        pendingContractOwners[msg.sender] = false;
        return true;
    }
    function isOwner(address add) returns (bool)
    {
      return contractOwners[add];
    }

    // Root previleges.
    function forwardCall(address _to, uint _value, bytes _data) onlyOwner() returns(bool) {
        if (!_to.call.value(_value)(_data)) {
            throw;
        }
        return true;
    }
}

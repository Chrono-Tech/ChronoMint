pragma solidity ^0.4.4;

contract Managed {
  uint public percentage_required;
  mapping(address => bool) public authorized_keys;
  uint public num_authorized_keys;
  mapping(address => PendingKey) private pending_authorized_keys;

  struct PendingKey {
        address key;
        mapping(address => bool) voters;
        uint voteCount;
    }

    function Managed() {
      address owner  = tx.origin;
      authorized_keys[owner] = true;
      num_authorized_keys++;
      percentage_required = 50;
    }

    modifier onlyAuthorized() {
        if (isAuthorized(msg.sender)) {
            _;
        } else {
          return;
        }
    }

    function isAuthorized(address key) returns(bool) {
        if (authorized_keys[key] == true){
          return true;
        }
        else
          return false;
    }

    function revokeAuthorization(address key) onlyAuthorized() returns(bool) {
      if (authorized_keys[key] == true && key != msg.sender){
          authorized_keys[key] = false;
          return true;
      }
      else
        return false;
    }

    function addKey(address key) onlyAuthorized() returns(bool) {
      if (authorized_keys[key] != true) {
          if(!pending_authorized_keys[key].voters[msg.sender]){
            pending_authorized_keys[key].voters[msg.sender] = true;
            pending_authorized_keys[key].voteCount++;
          }
          else
          {
            return false;
          }

          uint temp = pending_authorized_keys[key].voteCount*100;
          uint percentage_consensus = temp/num_authorized_keys;

          if(percentage_consensus >= percentage_required){
            authorized_keys[key] = true;
            num_authorized_keys++;
          }

          return true;

      }
      else
        return false;

    }

    function forwardCall(address _to, uint _value, bytes _data) onlyAuthorized() returns(bool) {
        if (!_to.call.value(_value)(_data)) {
            throw;
        }
        return true;
    }
}

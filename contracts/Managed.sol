pragma solidity ^0.4.4;

contract Managed {
  uint public percentageRequired;
  uint public numAuthorizedKeys;
  mapping(address => bool) public authorizedKeys;
  mapping(string => uint) internal uintSettings;
  mapping(string => address) internal addressSettings;
  mapping(address => PendingAddress) private pendingAuthorizedKeys;
  mapping(address => PendingAddress) private pendingRevokedKeys;
  mapping(string  => mapping(address => PendingAddress)) internal pendingAddressSettings;
  mapping(string => mapping(address => address)) lastVoteBySender;
  mapping(string=> mapping(uint => PendingUint)) internal pendingUintSettings;

  struct PendingAddress {
        address val;
        mapping(address => bool) voters;
        uint voteCount;
    }
  struct PendingUint {
        uint val;
        mapping(address => bool) voters;
        uint voteCount;
    }

  function Managed() {
    address owner  = tx.origin;
    authorizedKeys[owner] = true;
    numAuthorizedKeys++;
    percentageRequired = 50;
  }

  modifier onlyAuthorized() {
      if (isAuthorized(msg.sender)) {
          _;
      }
  }

  function isAuthorized(address key) returns(bool) {
      if (authorizedKeys[key]){
        return true;
      }
      else
        return false;
  }

  function revokeKey(address key) onlyAuthorized() returns(bool) {
    if (authorizedKeys[key] == true) { // Make sure that the key being submitted is a CBE.
        if(!pendingRevokedKeys[key].voters[msg.sender]){ // make sure this CBE hasn't voted for this key yet
          pendingRevokedKeys[key].voters[msg.sender] = true; // add this voter to the list of voters for this pending revocation
          pendingRevokedKeys[key].voteCount++; // increment vote count
        }

        uint temp = pendingRevokedKeys[key].voteCount*100;
        uint percentage_consensus = temp/numAuthorizedKeys; // percentage of votes for this revocation

        if(percentage_consensus >= percentageRequired){ // key has met conditions for revocation
          authorizedKeys[key] = false; // set key as unauthorized
          numAuthorizedKeys--; // decrement authorized key count
        }

        return true;

    }
    else
      return false;

  }

  function getAddressSetting(string name) returns(address){
    return addressSettings[name];
  }

  function getUintSetting(string name) returns(uint){
    return uintSettings[name];
  }

  function setAddress(string name, address value) onlyAuthorized() returns (bool){
    if (addressSettings[name] != value) { // Make sure that the key being submitted isn't already the value in the contract.
        address lastVal = lastVoteBySender[name][msg.sender];
        if(!pendingAddressSettings[name][value].voters[msg.sender]){
          if(pendingAddressSettings[name][lastVal].voters[msg.sender])
          {
            pendingAddressSettings[name][lastVal].voters[msg.sender] = false;
            pendingAddressSettings[name][lastVal].voteCount--;
          }
          pendingAddressSettings[name][value].voters[msg.sender] = true; // add this voter to the list of voters for this pending key
          pendingAddressSettings[name][value].voteCount++; // increment vote count
        }
        lastVoteBySender[name][msg.sender] = value;
        uint temp = pendingAddressSettings[name][value].voteCount*100;
        uint percentage_consensus = temp/numAuthorizedKeys; // percentage of votes for this key

        if(percentage_consensus >= percentageRequired){ // key has met conditions for authorization
          addressSettings[name] = value;  // set key as authorized
          pendingAddressSettings[name][value].voteCount = 0; // reset vote count
        }

        return true;
    }
    else
      return false;

  }

  function setUint(string name, uint value) onlyAuthorized() returns (bool){
    if (uintSettings[name] != value) { // Make sure that the key being submitted isn't already the value in the contract.
        if(!pendingUintSettings[name][value].voters[msg.sender]){
          pendingUintSettings[name][value].voters[msg.sender] = true; // add this voter to the list of voters for this pending key
          pendingUintSettings[name][value].voteCount++; // increment vote count
        }

        uint temp = pendingUintSettings[name][value].voteCount*100;
        uint percentage_consensus = temp/numAuthorizedKeys; // percentage of votes for this key

        if(percentage_consensus >= percentageRequired){ // key has met conditions for authorization
          uintSettings[name] = value;  // set key as authorized
          pendingUintSettings[name][value].voteCount = 0; // reset vote count
        }

        return true;
    }
    else
      return false;

  }

  function addKey(address key) onlyAuthorized() returns(bool){
    if (authorizedKeys[key] != true) { // Make sure that the key being submitted isn't already CBE.
        if(!pendingAuthorizedKeys[key].voters[msg.sender]){ // make sure this CBE hasn't voted for this key yet
          pendingAuthorizedKeys[key].voters[msg.sender] = true; // add this voter to the list of voters for this pending key
          pendingAuthorizedKeys[key].voteCount++; // increment vote count
        }

        uint temp = pendingAuthorizedKeys[key].voteCount*100;
        uint percentage_consensus = temp/numAuthorizedKeys; // percentage of votes for this key

        if(percentage_consensus >= percentageRequired){ // key has met conditions for authorization
          authorizedKeys[key] = true;  // set key as authorized
          pendingAuthorizedKeys[key].voteCount = 0; // reset vote count
          numAuthorizedKeys++; // increment authorized keys so we have an accurate total
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

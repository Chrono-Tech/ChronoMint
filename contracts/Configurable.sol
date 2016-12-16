pragma solidity ^0.4.4;

import "Managed.sol";

contract Configurable is Managed {
  event AddressVoteReceived(string issue, address value, address voter);
  event UintVoteReceived(string issue, uint value, address voter);
  mapping(string => uint) internal uintSettings;
  mapping(string => address) internal addressSettings;
  mapping(string  => mapping(address => PendingAddress)) internal pendingAddressSettings;
  mapping(string=> mapping(uint => PendingUint)) internal pendingUintSettings;
  mapping(string => mapping(address => address)) lastAddressVoteBySender;
  mapping(string => mapping(address => uint)) lastUintVoteBySender;

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

  function getAddress(string name) returns(address){
    return addressSettings[name];
  }

  function getUint(string name) returns(uint){
    return uintSettings[name];
  }

  function setAddress(string name, address value) onlyAuthorized() returns (bool){
    if (addressSettings[name] != value) { // Make sure that the key being submitted isn't already the value in the contract.
      address lastVal = lastAddressVoteBySender[name][msg.sender];
      if (!pendingAddressSettings[name][value].voters[msg.sender]){
        AddressVoteReceived(name, value, msg.sender);
        if (pendingAddressSettings[name][lastVal].voters[msg.sender])
        {
          pendingAddressSettings[name][lastVal].voters[msg.sender] = false;
          pendingAddressSettings[name][lastVal].voteCount--;
        }
        pendingAddressSettings[name][value].voters[msg.sender] = true; // add this voter to the list of voters for this pending key
        pendingAddressSettings[name][value].voteCount++; // increment vote count
      }
      lastAddressVoteBySender[name][msg.sender] = value;
      uint percentage_consensus = (pendingAddressSettings[name][value].voteCount*100)/numAuthorizedKeys;

      if (percentage_consensus >= percentageRequired){ // key has met conditions for authorization
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
      uint lastVal = lastUintVoteBySender[name][msg.sender];
      if (!pendingUintSettings[name][value].voters[msg.sender]){
        UintVoteReceived(name, value, msg.sender);
        if (pendingUintSettings[name][lastVal].voters[msg.sender])
        {
          pendingUintSettings[name][lastVal].voters[msg.sender] = false;
          pendingUintSettings[name][lastVal].voteCount--;
        }
        pendingUintSettings[name][value].voters[msg.sender] = true; // add this voter to the list of voters for this pending key
        pendingUintSettings[name][value].voteCount++; // increment vote count
      }
      lastUintVoteBySender[name][msg.sender] = value;

      uint percentage_consensus = (pendingUintSettings[name][value].voteCount*100)/numAuthorizedKeys; // percentage of votes for this key

      if (percentage_consensus >= percentageRequired){ // key has met conditions for authorization
        uintSettings[name] = value;  // set key as authorized
        pendingUintSettings[name][value].voteCount = 0; // reset vote count
      }

      return true;
    }
    else
      return false;

  }
}

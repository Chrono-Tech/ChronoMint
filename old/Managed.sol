pragma solidity ^0.4.4;

contract Managed {
  uint public percentageRequired;
  uint public numAuthorizedKeys;
  mapping(bytes32 => uint) lastVoteBySender;
  event VoteReceived(string indexed issue, uint indexed value, uint indexed voteCount);
  event VotePassed(string indexed issue, uint indexed value, uint indexed voteCount);
  mapping(bytes32 => PendingAction) internal pendingActions;
  mapping(address => bool) public authorizedKeys;
  struct PendingAction {
        uint startTime;
        uint passedTime;
        mapping(address => bool) voters;
        uint voteCount;
    }

  function Managed() {
    address owner  = msg.sender;
    authorizedKeys[owner] = true;
    numAuthorizedKeys++;
    percentageRequired = 50;
  }

  modifier onlyAuthorized() {
      if (isAuthorized(msg.sender)) {
          _;
      }
  }

  modifier byVote(address subject, string name, uint currentValue, uint newValue, bool oneValuePerName) {
    if (currentValue != newValue) { // Make sure that the issue being submitted isn't already set.
      uint lastVal = lastVoteBySender[sha3(name,msg.sender)];
      bytes32 issueID = sha3(subject, name, newValue);
      bytes32 oldIssueID = sha3(subject, name, lastVal);
      if (!pendingActions[issueID].voters[msg.sender] || pendingActions[oldIssueID].startTime == 0){
        pendingActions[issueID].startTime = now;
        if (pendingActions[oldIssueID].voters[msg.sender] && oneValuePerName)
        {
          setVote(subject, name,lastVal, msg.sender, false);
        }
        setVote(subject, name,newValue, msg.sender, true);
      }
      lastVoteBySender[sha3(name,msg.sender)] = newValue;
      VoteReceived(name, newValue, pendingActions[issueID].voteCount);
      uint percentage_consensus = (pendingActions[issueID].voteCount*100)/numAuthorizedKeys; // percentage of votes for this issue
      if (percentage_consensus >= percentageRequired){ // issue has met conditions for authorization
        _; // set key as authorized
        /*VotePassed(name, newValue, pendingActions[issueID].voteCount);*/
        pendingActions[oldIssueID].passedTime = now;
      }
    }
  }

  function isAuthorized(address key) returns(bool) {
      if (authorizedKeys[key]){
        return true;
      }
      else
        return false;
  }

  function setVote(address subject, string name, uint value, address voter, bool affirm) {
      bytes32 index = sha3(subject, name, value);
      pendingActions[index].voters[msg.sender] = affirm;
    if(affirm)
    {
      pendingActions[index].voteCount++;
    }
    else
    {
      pendingActions[index].voteCount--;
    }

  }
  function hasString(string[] arr, string val) internal returns(bool){
    for(uint i = 0; i < arr.length; i++)
    {
        if(sha3(arr[i]) == sha3(val))
        {
          return true;
        }
    }
    return false;
  }

  function addKey(address key) onlyAuthorized() byVote(address(this), 'ADMIN', 0x0, uint(key), false) {
    if (!authorizedKeys[key]) { // Make sure that the key being submitted isn't already CBE.
      authorizedKeys[key] = true;
      numAuthorizedKeys++;
    }
  }

  function revokeKey(address key) onlyAuthorized() byVote(address(this), 'REVOKE', 0x0, uint(key), false) {
    if (authorizedKeys[key]) { // Make sure that the key being submitted isn't already CBE.
      authorizedKeys[key] = false;
      numAuthorizedKeys--;
    }
  }

}

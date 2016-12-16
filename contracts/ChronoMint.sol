pragma solidity ^0.4.4;

import "Configurable.sol";
import "Stub.sol";

contract ChronoMint is Configurable {
  /*event Proposed(string contractType, address newContract, address proposer);*/
  event  Vote(address newContract, uint newVoteCount);
  uint LHContractsCount;
  uint LOCCount;
  address public timeContract;
  address public rewardsContract;
  LOC[] offeringCompaniesByIndex;
  mapping(string => uint) private totals;
  mapping(uint => LHContract) public lhContracts;
  mapping(address => LOC) public offeringCompanies;

  function proposeLOC (string _name, string _website, address _controller, uint _issueLimit, string _publishedHash) onlyAuthorized {
    LOC newContract = new LOC(_name, _website, _controller, _issueLimit, _publishedHash);
    offeringCompanies[address(newContract)] = newContract;
    offeringCompaniesByIndex.push(newContract);
    uint vc = newContract.addApprover(msg.sender);
    Vote(address(newContract), vc);
    LOCCount++;
  }
  function getLOC(uint id) public returns (LOC) { return offeringCompaniesByIndex[id];}
  function approveLOC(address _LOC) onlyAuthorized {
    uint vc = offeringCompanies[_LOC].addApprover(msg.sender);
    Vote(_LOC, vc);
    uint percentage_consensus = (vc*100)/numAuthorizedKeys;
    if (percentage_consensus >= percentageRequired){
      offeringCompanies[_LOC].setStatus(LOC.Status.active);
    }
  }

  function proposeLHContract(string _currency, uint _rate) onlyAuthorized returns(uint) {
    uint id = totals['lh'];
    LHContract newContract = new LHContract(id, _currency, _rate);
    lhContracts[id] = newContract;
    totals['lh']++;
    return id;
  }

  function setTimeContract(address _tc) onlyAuthorized {
    addressSettings['timeContract'] = _tc;
  }


  function setRewardsContract(address _rc) onlyAuthorized {
    addressSettings['rewardsContract'] = _rc;
  }

  function editAddress(string name, address val) onlyAuthorized {
    addressSettings[name] = val;
  }

  function ChronoMint(address _tc, address _rc){
    addressSettings['timeContract'] = _tc;
    addressSettings['rewardsContract'] = _rc;
    uintSettings['securityPercentage'] = 1;
    uintSettings['liquidityPercentage'] = 1;
    uintSettings['insurancePercentage'] = 1;
    uintSettings['insuranceDuration'] = 1;
  }

  function()
  {
    throw;
  }
}

contract LOC {
  enum Status  {proposed, active, suspended, bankrupt}
  ChronoMint chronoMint;
  Status public status;
  address controller;
  mapping(string => string) stringSettings;
  mapping(string => uint) uintSettings;
  mapping(address => bool) approvers;
  uint public approverCount;


  modifier onlyMint() {
    if (isMint(msg.sender)) {
      _;
      } else {
        return;
      }
  }

  modifier onlyController() {
    if ((isController(msg.sender) && status == Status.active) || isMint(msg.sender)) {
      _;
      } else {
        return;
      }
  }

    function setUint(string name, uint value) onlyMint()
    {
        uintSettings[name] = value;
    }

    function LOC(string _name, string _website, address _controller, uint _issueLimit, string _publishedHash){
      chronoMint = ChronoMint(msg.sender);
      controller = _controller;
      status = Status.proposed;
      stringSettings["name"] = _name;
      stringSettings["website"] = _website;
      stringSettings["publishedHash"] = _publishedHash;
      uintSettings["issueLimit"] = _issueLimit;
      uintSettings["redeemed"] = 0;
    }

    function isController(address _ad) returns(bool) {
      if (_ad == controller)
        return true;
      else
        return false;
    }

    function isMint(address _ad) returns(bool) {
      if (_ad == address(chronoMint))
        return true;
      else
        return false;
    }

    function addApprover(address approver) onlyMint returns(uint)
    {
      if (!approvers[approver]){
        approvers[approver] = true;
        approverCount++;
      }
      return approverCount;
    }

    function isAdmin(address _ad) returns(bool) {
      return chronoMint.isAuthorized(_ad);
    }
    function getName() returns(string) {
      return stringSettings["name"];
    }

    function setStatus(Status _status) onlyMint {
      status = _status;
    }

    function setIssueLimit(uint _issueLimit) onlyMint {
      uintSettings["issueLimit"] = _issueLimit;
    }

    function setController(address _controller) onlyController {
      controller = _controller;
    }

    function setWebsite(string _website) onlyController {
      stringSettings["website"] = _website;
    }
}

contract LHContract {
  uint id;
  uint rate;
  string currency;
  mapping(address=>bool) controllers;
  mapping(address=>LOC) offeringCompanies;
  ChronoMint chronoMint;

  modifier onlyMint() {
      if (msg.sender == address(chronoMint)) {
          _;
      } else {
        return;
      }
  }

  modifier onlyLOC() {
      if (isLOC(msg.sender) || isMint(msg.sender)){
          _;
      } else {
        return;
      }
  }

  function isLOC(address _ad) returns(bool) {
    if (controllers[_ad])
      return true;
    else
      return false;
  }

  function isMint(address _ad) returns(bool) {
    if (_ad == address(chronoMint))
      return true;
    else
      return false;
  }

  function isAdmin(address _ad) returns(bool) {
    return chronoMint.isAuthorized(_ad);
  }

  function LHContract(uint _id, string _currency, uint _rate) {
    chronoMint = ChronoMint(msg.sender);
    id = _id;
    currency = _currency;
    rate = _rate;
  }

  function addLOC(LOC loc) onlyMint returns (bool) {
    offeringCompanies[address(loc)] = loc;
  }
}


contract TimeContract is Stub {}

contract RewardsContract is Stub {}

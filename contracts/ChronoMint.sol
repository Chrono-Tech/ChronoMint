pragma solidity ^0.4.4;


import "Managed.sol";
import "Stub.sol";

contract ChronoMint is Managed {
  enum Status  {active, suspended, bankrupt}
  uint public LHContractsCount;
  uint public LOCCount;
  address public timeContract;
  address public rewardsContract;
  uint public securityPercentage;
  uint public liquidityPercentage;
  uint public insurancePercentage;
  uint public insuranceDuration;
  mapping(string => uint) private totals;
  mapping(uint => LHContract) public lhContracts;
  mapping(uint => LOC) public offeringCompanies;



  function addLOC(string _name, string _website, address _controller, uint _issueLimit, uint _redeemed, string _publishedHash) onlyAuthorized returns(uint){
    uint id = totals['loc'];
    LOC newContract = new LOC(totals['loc'], _name, _website, _controller, _issueLimit, _redeemed, _publishedHash);
    offeringCompanies[id] = newContract;
    totals['loc']++;
    return id;
  }

  function addLHContract(string _currency, uint _rate) onlyAuthorized returns(uint) {
    uint id = totals['lh'];
    LHContract newContract = new LHContract(id, _currency, _rate);
    lhContracts[id] = newContract;
    totals['lh']++;
    return id;
  }

  function setTimeContract(address _tc) onlyAuthorized returns(address) {
    timeContract = _tc;
    return timeContract;
  }


  function setRewardsContract(address _rc) onlyAuthorized returns(bool) {
    rewardsContract = _rc;
    return true;
  }

  function ChronoMint(address _tc, address _rc){
    timeContract = _tc;
    rewardsContract = _rc;
  }

  function()
  {
    throw;
  }
}

contract LHContract {
  uint id;
  uint rate;
  string currency;
  mapping(address=>bool) controllers;
  LOC[] offeringCompanies;
  ChronoMint chronoMint;

  modifier onlyAdmin() {
      if (isAdmin(msg.sender)) {
          _;
      } else {
        return;
      }
  }

  modifier onlyController() {
      if (isController(msg.sender)) {
          _;
      } else {
        return;
      }
  }

  function isController(address _ad) returns(bool) {
    if(controllers[_ad])
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

  function addLOC(LOC loc) onlyAdmin returns (bool) {
    offeringCompanies.push(loc);
  }
}

contract LOC {
  enum Status  {active, suspended, bankrupt}
  uint id;
  string name;
  string website;
  Status status;
  address controller;
  uint issueLimit;
  uint redeemed;
  string publishedHash;
  ChronoMint chronoMint;

  modifier onlyAdmin() {
      if (isAdmin(msg.sender)) {
          _;
      } else {
        return;
      }
  }

  modifier onlyController() {
      if (isController(msg.sender)) {
          _;
      } else {
        return;
      }
  }

  function LOC(uint _id, string _name, string _website, address _controller, uint _issueLimit, uint _redeemed, string _publishedHash){
    chronoMint = ChronoMint(msg.sender);
    id = _id;
    name = _name;
    website = website;
    status = Status.active;
    controller = _controller;
    issueLimit = _issueLimit;
    redeemed = _redeemed;
    publishedHash = _publishedHash;

  }

  function isController(address _ad) returns(bool) {
    if(_ad == controller)
      return true;
    else
      return false;

  }

  function isAdmin(address _ad) returns(bool) {
    return chronoMint.isAuthorized(_ad);
  }

  function setStatus(Status _status) onlyAdmin returns (bool) {
    status = _status;
    return true;
  }

  function setIssueLimit(uint _issueLimit) onlyAdmin returns (bool) {
    issueLimit = _issueLimit;
    return true;
  }

  function setController(address _controller) onlyController returns (bool) {
    controller = _controller;
    return true;
  }

  function setWebsite(string _website) onlyController returns (bool) {
    website = _website;
    return true;
  }
}

contract TimeContract is Stub {}

contract RewardsContract is Stub {}

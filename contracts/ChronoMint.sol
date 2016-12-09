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

contract LHContract is Managed {
  uint id;
  uint rate;
  string currency;
  address[] controller;
  LOC[] offeringCompanies;
  address chronoMint;

  function LHContract(uint _id, string _currency, uint _rate){
    chronoMint = msg.sender;
    id = _id;
    currency = _currency;
    rate = _rate;

  }

  function addLOC(LOC loc) onlyAuthorized returns (bool){
    offeringCompanies.push(loc);
  }

}
contract LOC is Managed{
  enum Status  {active, suspended, bankrupt}
  uint id;
  string name;
  string website;
  Status status;
  address controller;
  uint issueLimit;
  uint redeemed;
  string publishedHash;
  address chronoMint;

  function LOC(uint _id, string _name, string _website, address _controller, uint _issueLimit, uint _redeemed, string _publishedHash){
    chronoMint = msg.sender;
    id = _id;

    name = _name;
    website = website;
    status = Status.active;
    controller = _controller;
    issueLimit = _issueLimit;
    redeemed = _redeemed;
    publishedHash = _publishedHash;

  }

}

contract TimeContract is Stub {}

contract RewardsContract is Stub {}

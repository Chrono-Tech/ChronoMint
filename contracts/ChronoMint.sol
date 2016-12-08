pragma solidity ^0.4.4;

import "Owned.sol";
import "Stub.sol";

contract ChronoMint {
  enum Status  {active, suspended, bankrupt}
  uint public LHContractsCount;
  uint public LOCCount;
  address public timeContract;
  address public rewardsContract;
  struct LOC {
        string name;
        string website;
        Status status;
        address controller;
        uint issueLimit;
        uint redeemed;
        string publishedHash;
    }
  struct LHContract {
        string currency;
        uint rate;
        uint[] offeringCompanies;
    }

  mapping(uint => LHContract) public lhContracts;
  mapping(uint => LOC) offeringCompanies;

  function addLOC(string _name, string _website, Status _status, address _controller, uint _issueLimit, uint _redeemed, string _publishedHash) returns(uint) {
    LOCCount++;
    offeringCompanies[LOCCount] = LOC(_name, _website, Status.active, msg.sender, _issueLimit, _redeemed, _publishedHash);
    return LOCCount;
  }
 
  function setTimeContract(address _tc) returns(address) {
    timeContract = _tc;
    return timeContract;
  }

  function getLOC(uint _locID) returns(string) {
    return offeringCompanies[_locID].name;
  }

  function setRewardsContract(address _rc) returns(bool) {
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

contract TimeContract is Stub {}

contract RewardsContract is Stub {}

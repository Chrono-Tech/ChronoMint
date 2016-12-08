pragma solidity ^0.4.4;

import "Owned.sol";
import "Stub.sol";

contract ChronoMint is Owned {
  enum Status  {active, suspended, bankrupt}
  uint public LHContractsCount;
  uint public LOCCount;
  address public timeContract;
  address public rewardsContract;
  function setRewardsContract(RewardsContract _rc) onlyOwner
  {
    rewardsContract = _rc;
  }
  function setTimeContract(address _tc) onlyOwner
  {
    timeContract = _tc;
  }

  struct LOC {
        uint index;
        string name;
//        string website;
//        Status status;
//        address controller;
//        uint issueLimit;
//        uint redeemed;
//        string publishedHash;
    }
  struct LHContract {
        string currency;
        uint rate;
        uint[] offeringCompanies;
    }

  mapping(uint => LHContract) public lhContracts;
  mapping(uint => LOC) public offeringCompanies;
  function addLOC(string _name, string _website, Status _status, address _controller, uint _issueLimit, uint _redeemed, string _publishedHash) onlyAuthorized {
    offeringCompanies[LOCCount] = LOC(LOCCount, _name, _website, _status, _controller, _issueLimit, _redeemed, _publishedHash);
    LOCCount++;
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

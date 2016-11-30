pragma solidity ^0.4.4;

import "Owned.sol";
import "Stub.sol";

contract ChronoMint is Owned {
  enum Status  {active, suspended, bankrupt}
  uint public LHContractsCount;
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
  mapping(uint => LOC) public offeringCompanies;

}

contract TimeContract is Stub {

}

contract RewardsContract is Stub {

}

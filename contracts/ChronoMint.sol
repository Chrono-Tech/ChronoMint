pragma solidity ^0.4.4;

import "Configurable.sol";
import "Stub.sol";
import "LOC.sol";
import "LaborHourToken.sol";

contract ChronoMint is Managed, Configurable {
  LOC[] offeringCompaniesByIndex;
  LOC[] laborHourTokensByIndex;
  /*mapping(address => LaborHourToken) public laborHourTokens;*/
  mapping(address => LOC) public offeringCompanies;
  mapping(address => LaborHourToken) public laborHourTokens;

  function getAddress(string name) constant returns(address) {
    return address(settings[name]);
  }

  function getValue(string name) constant returns(uint) {
    return settings[name];
  }

  function setAddress(string name, address value) {
    setValue(name,uint(value));
  }

  function setValue(string name, uint value) byVote(address(this), name, settings[name], value, true) onlyAuthorized() {
    setVal(name,uint(value));
  }

  function setContractValue(address subject, string name, uint value) byVote(subject, name, ChronoMintDeployable(subject).getVal(name), value, true) onlyAuthorized() {
    ChronoMintDeployable(subject).setValue(name,uint(value));
  }

  function proposeLOC (address newLOC) onlyAuthorized {
    offeringCompanies[newLOC] = LOC(newLOC);
    approveContract(newLOC);
  }

  function proposeLaborHourToken(address newLaborHourToken) onlyAuthorized {
    laborHourTokens[newLaborHourToken] = LaborHourToken(newLaborHourToken);
    approveContract(newLaborHourToken);
  }

  function approveContract(address newContract) onlyAuthorized() byVote(address(this), 'deployable', 0x0, uint(newContract), false) {
    ChronoMintDeployable(newContract).approved();
  }

  function ChronoMint(address _tc, address _rc){
    settings['timeContract'] = uint(_tc);
    settings['rewardsContract'] = uint(_rc);
    settings['securityPercentage'] = 1;
    settings['liquidityPercentage'] = 1;
    settings['insurancePercentage'] = 1;
    settings['insuranceDuration'] = 1;
  }

  function()
  {
    throw;
  }
}


contract TimeContract is Stub {}

contract RewardsContract is Stub {}

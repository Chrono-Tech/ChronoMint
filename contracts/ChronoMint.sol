pragma solidity ^0.4.4;

import "Configurable.sol";
import "Stub.sol";
import "LOC.sol";
import "LHC.sol";

contract ChronoMint is Managed, Configurable {
  LOC[] offeringCompaniesByIndex;
  LOC[] LHCsByIndex;
  /*mapping(address => LHC) public LHCs;*/
  mapping(address => LOC) public offeringCompanies;

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
    LOC newContract = LOC(newLOC);
    offeringCompanies[newLOC] = newContract;
    offeringCompaniesByIndex.push(newContract);
    approveContract(newLOC);
  }

  /*function proposeLHC(string _currency, uint _rate) onlyAuthorized {
    LHC newContract = new LHC(_currency, _rate);
    //LHCs[address(newContract)] = newContract;
    approveContract(address(newContract));
  }*/

  function getLOC(uint id) constant returns (LOC) { return offeringCompaniesByIndex[id];}

  function approveContract(address _LOC) onlyAuthorized() byVote(address(this), 'deployable', 0x0, uint(_LOC), false) {
    ChronoMintDeployable(_LOC).approved();
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

pragma solidity ^0.4.4;

import "Managed.sol";
import "ChronoMintConfigurable.sol";

contract LaborHourToken is ChronoMintConfigurable {
  enum Status  {maintenance, active}
  event LOCadded(address added);
  Status public status;
  string currency;
  mapping(address=>bool) offeringCompanies;

  modifier onlyCBE() {
      if (isCBE(msg.sender)) {
          _;
      } else {
        return;
      }
  }

  modifier onlyLOC() {
      if (isLOC(msg.sender) || isCBE(msg.sender)){
          _;
      } else {
        return;
      }
  }

  function isLOC(address _ad) returns(bool) {
    return offeringCompanies[_ad];
  }

  function isCBE(address _ad) returns(bool) {
    return Managed(chronoMint).isAuthorized(_ad);
  }

  function LaborHourToken(address _mint, string _currency, uint _rate) {
    settings['totalSupply'] = 0;
    status = Status.maintenance;
    stringSettings['currency'] = _currency;
    settings['rate'] = _rate;
  }

  function setStatus(Status _status) onlyMint {
    status = _status;
  }

  function issueToken(uint quantity) onlyLOC() {
    settings['totalSupply'] = settings['totalSupply'] + quantity;
  }

  function approved() onlyMint{
    setStatus(Status.active);
  }

  function addLOC(address loc) onlyCBE {
    offeringCompanies[loc] = true;
    settings['locCount']++;
    LOCadded(loc);
  }
}

pragma solidity ^0.4.4;

import "ChronoMintDeployable.sol";
import "LOC.sol";


contract LHC is ChronoMintDeployable {
  uint rate;
  string currency;
  /*mapping(address=>bool) offeringCompanies;*/

  /*modifier onlyMint() {
      if (msg.sender == chronoMint) {
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
    if (offeringCompanies[_ad])
      return true;
    else
      return false;
  }

  function isMint(address _ad) returns(bool) {
    if (_ad == chronoMint)
      return true;
    else
      return false;
  }*/

  function LHC(string _currency, uint _rate) {
    /*currency = _currency;
    rate = _rate;*/
  }

  function approved(){
    return;
  }
  /*function addLOC(address loc) onlyMint returns (bool) {
    offeringCompanies[loc] = true;
  }*/
}

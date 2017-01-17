pragma solidity ^0.4.4;

import "ChronoMintConfigurable.sol";
import "LaborHourToken.sol";

contract LOC is ChronoMintConfigurable {
  enum Status  {maintenance, active, suspended, bankrupt}
  Status public status;

  function setLOCdata(string _name, address _mint, address _controller, uint _issueLimit, string _publishedHash, uint _expDate){
    chronoMint = _mint;
    status = Status.maintenance;
    settings['controller'] = uint(_controller);
    stringSettings["name"] = _name;
    stringSettings["publishedHash"] = _publishedHash;
    settings["issueLimit"] = _issueLimit;
    settings["issued"] = 0;
    settings["redeemed"] = 0;
  }

  function approved() onlyMint{
    setStatus(Status.active);
  }

  function isController(address _ad) returns(bool) {
    if (uint(_ad) == settings["controller"])
      return true;
    else
      return false;
  }

  modifier onlyController() {
    if ((isController(msg.sender) && status == Status.active) || isMint(msg.sender)) {
      _;
      } else {
        return;
      }
  }

  function getName() constant returns(string) {
    return stringSettings["name"];
  }

  function getValue(string name) constant returns(uint) {
    return settings[name];
  }

  function getAddress(string name) constant returns(address) {
    return address(settings[name]);
  }

  function setStatus(Status _status) onlyMint {
    status = _status;
  }

  function setController(address _controller) onlyController {
    settings["controller"] =  uint(_controller);
  }

  function burnTokens(address token, uint qty) onlyController {
    if(LaborHourToken(token).balanceOf(this) >= qty)
    {
      LaborHourToken(token).burn(qty);
      settings["redeemed"] += qty;
    }
  }

  function issueTokens(address token, uint qty) onlyController {
    if(settings["issued"] + qty <= settings["issueLimit"])
    {
      LaborHourToken(token).mint(qty);
      LaborHourToken(token).approve(msg.sender, qty);
      settings["issued"] += qty;
    }
  }

  function setName(string _name) onlyController {
    stringSettings["name"] = _name;
  }

  function setWebsite(string _website) onlyController {
    stringSettings["website"] = _website;
  }
}

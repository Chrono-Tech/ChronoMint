pragma solidity ^0.4.4;

import "ChronoMintDeployable.sol";

contract LOC is ChronoMintDeployable {
  enum Status  {proposed, active, suspended, bankrupt}
  Status public status;
  address controller;
  mapping(address => bool) approvers;
  uint public approverCount;

  modifier onlyController() {
    if ((isController(msg.sender) && status == Status.active) || isMint(msg.sender)) {
      _;
      } else {
        return;
      }
  }

  function LOC(string _name, address _controller, uint _issueLimit, string _publishedHash){
    controller = _controller;
    status = Status.proposed;
    stringSettings["name"] = _name;
    stringSettings["publishedHash"] = _publishedHash;
    settings["issueLimit"] = _issueLimit;
    settings["redeemed"] = 0;
  }

  function approved(){
    setStatus(Status.active);
  }

  function isController(address _ad) returns(bool) {
    if (_ad == controller)
      return true;
    else
      return false;
  }

  function getName() returns(string) {
    return stringSettings["name"];
  }

  function setStatus(Status _status) onlyMint {
    status = _status;
  }

  function setIssueLimit(uint _issueLimit) onlyMint {
    settings["issueLimit"] = _issueLimit;
  }

  function setController(address _controller) onlyController {
    controller = _controller;
  }

  function setWebsite(string _website) onlyController {
    stringSettings["website"] = _website;
  }
}

pragma solidity ^0.4.4;

import "Managed.sol";
import "ChronoBankAsset.sol";
import "ChronoMintConfigurable.sol";
import "ERC20Interface.sol";

contract LaborHourToken is ChronoMintConfigurable, ERC20Interface, ChronoBankAsset {
  enum Status  {maintenance, active}
  event LOCadded(address added);
  address public feeAddress;
  Status public status;
  string currency;
  mapping(address=>bool) offeringCompanies;
  mapping(address=>uint256) balances;
  mapping(address=>mapping(address=>uint256)) allowances;

  modifier onlyLOC() {
    MessageSender(msg.sender);
      if (isLOC(msg.sender) || isMint(msg.sender)){
          _;
      } else {
        return;
      }
  }

  function isLOC(address _ad) returns(bool) {
    return offeringCompanies[_ad];
  }




    modifier takeFee(address _from, uint _fromValue, address _sender, bool[1] memory _success) {
        if (_transferFee(_from, _fromValue, _sender)) {
            _;
            if (!_success[0] && _subjectToFees(_from, _fromValue)) {
                throw;
            }
        }
    }


  function LaborHourToken(address _mint, string _currency, uint _rate) {
    chronoMint = _mint;
    settings['FEE_PERCENT'] = 15; // 0.15% we can get this from Mint later.
    settings['totalSupply'] = 0;
    status = Status.maintenance;
    stringSettings['currency'] = _currency;
    settings['rate'] = _rate;
  }

  function setStatus(Status _status) onlyMint {
    status = _status;
  }

  function setupFee(address _feeAddress) onlyMint() returns(bool) {
        feeAddress = _feeAddress;
        return true;
    }

    function _transferWithReference(address _to, uint _value, string _reference, address _sender) internal returns(bool) {
        return _transferWithReference(_to, _value, _reference, _sender, [false]);
    }

    function _transferWithReference(address _to, uint _value, string _reference, address _sender, bool[1] memory _success) takeFee(_sender, _value, _sender, _success) internal returns(bool) {
        _success[0] = super._transferWithReference(_to, _value, _reference, _sender);
        return _success[0];
    }

    function _transferFromWithReference(address _from, address _to, uint _value, string _reference, address _sender) internal returns(bool) {
        return _transferFromWithReference(_from, _to, _value, _reference, _sender, [false]);
    }

    function _transferFromWithReference(address _from, address _to, uint _value, string _reference, address _sender, bool[1] memory _success) takeFee(_from, _value, _sender, _success) internal returns(bool) {
        _success[0] = super._transferFromWithReference(_from, _to, _value, _reference, _sender);
        return _success[0];
    }

    function _transferFee(address _feeFrom, uint _fromValue, address _sender) internal returns(bool) {
        if (!_subjectToFees(_feeFrom, _fromValue)) {
            return true;
        }
        return super._transferFromWithReference(_feeFrom, feeAddress, calculateFee(_fromValue), "Transaction fee", _sender);
    }

    function _subjectToFees(address _feeFrom, uint _fromValue) internal returns(bool) {
        return feeAddress != 0x0
            && feeAddress != _feeFrom
            && _fromValue != 0;
    }

    // Round up.
    function calculateFee(uint _value) constant returns(uint) {
        uint feeRaw = _value * settings['FEE_PERCENT'];
        return (feeRaw / 10000) + (feeRaw % 10000 == 0 ? 0 : 1);
    }

  function approved() onlyMint {
    status = Status.active;
  }

  function addLOC(address loc) onlyMint {
    offeringCompanies[loc] = true;
    settings['locCount']++;
    LOCadded(loc);
  }

  function mint(uint qty) onlyLOC {
    settings['totalSupply'] += qty;
    balances[msg.sender] += qty;
  }

  function burn(uint qty){
    settings['totalSupply'] = settings['totalSupply'] - qty;
    balances[msg.sender] = balances[msg.sender] - qty;
  }

  function totalSupply() constant returns (uint256 supply){
    return settings['totalSupply'];
  }
  function balanceOf(address _owner) constant returns (uint256 balance){
    return balances[_owner];
  }
  function transfer(address _to, uint256 _value) returns (bool success){
    balances[msg.sender] = balances[msg.sender] - _value;
    balances[_to] = balances[_to] + _value;
    return true;
  }
  function transferFrom(address _from, address _to, uint256 _value) returns (bool success){
    allowances[_from][msg.sender] -= _value;
    balances[_from] -= _value;
    balances[_to] += _value;
    return true;
  }
  function approve(address _spender, uint256 _value) returns (bool success){
    allowances[msg.sender][_spender] = allowances[msg.sender][_spender] + _value;
    return true;
  }
  function allowance(address _owner, address _spender) constant returns (uint256 remaining){
    return allowances[_owner][_spender];
  }
}

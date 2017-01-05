pragma solidity ^0.4.4;

import "ChronoBankAssetInterface.sol";
import {ChronoBankAssetProxyInterface as ChronoBankAssetProxy} from "ChronoBankAssetProxyInterface.sol";

contract ChronoBankAsset is ChronoBankAssetInterface {
    ChronoBankAssetProxy public proxy;

    modifier onlyProxy() {
        if (proxy == msg.sender) {
            _;
        }
    }

    function init(address _proxy) returns(bool) {
        if (address(proxy) != 0x0) {
            return false;
        }
        proxy = ChronoBankAssetProxy(_proxy);
        return true;
    }

    function __transferWithReference(address _to, uint _value, string _reference, address _sender) onlyProxy() returns(bool) {
        return _transferWithReference(_to, _value, _reference, _sender);
    }

    function _transferWithReference(address _to, uint _value, string _reference, address _sender) internal returns(bool) {
        return proxy.__transferWithReference(_to, _value, _reference, _sender);
    }

    function __transferFromWithReference(address _from, address _to, uint _value, string _reference, address _sender) onlyProxy() returns(bool) {
        return _transferFromWithReference(_from, _to, _value, _reference, _sender);
    }

    function _transferFromWithReference(address _from, address _to, uint _value, string _reference, address _sender) internal returns(bool) {
        return proxy.__transferFromWithReference(_from, _to, _value, _reference, _sender);
    }

    function __approve(address _spender, uint _value, address _sender) onlyProxy() returns(bool) {
        return _approve(_spender, _value, _sender);
    }

    function _approve(address _spender, uint _value, address _sender) internal returns(bool) {
        return proxy.__approve(_spender, _value, _sender);
    }
}

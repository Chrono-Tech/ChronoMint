
pragma solidity ^0.4.4;

contract ChronoBankAssetInterface {
    function __transferWithReference(address _to, uint _value, string _reference, address _sender) returns(bool);
    function __transferFromWithReference(address _from, address _to, uint _value, string _reference, address _sender) returns(bool);
    function __approve(address _spender, uint _value, address _sender) returns(bool);
    function __process(bytes _data, address _sender) payable {
        throw;
    }
}

pragma solidity ^0.6.0;
import "./CrossbarToken.sol";
import "./SafeMath.sol";

contract CrossbarTokenSale {
    CrossbarToken public token;
    uint256 public price;
    uint256 public tokensSold;
    address payable admin;
    bool saleEnded = false;
    event Sold(address indexed buyer, uint256 value);

    constructor(CrossbarToken _token, uint256 _price) public {
        admin = msg.sender;
        token = _token;
        price = _price;
    }

    function buyTokens(uint256 _noOfTokens) public payable {
        require(msg.value == SafeMath.mul(price, _noOfTokens));
        //require(saleEnded == false);
        require(token.balanceOf(address(this)) >= _noOfTokens);
        require(token.transfer(msg.sender, _noOfTokens));
        tokensSold += _noOfTokens;
        emit Sold(msg.sender, _noOfTokens);
    }

    function endSale() public {
        require(admin == msg.sender);
        require(token.transfer(admin, token.balanceOf(address(this))));
        saleEnded = true;
        selfdestruct(admin);
    }
}

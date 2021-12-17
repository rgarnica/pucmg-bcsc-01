//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "http://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.6/contracts/math/SafeMath.sol";

contract Marketplace {
    using SafeMath for uint;

    uint constant platformTax = 5;
    string public name;
    uint public productCount=0;
    mapping(uint => Product) public products;
    address payable public owner;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
        bool isForSelling;
    }

    event ProductCreated (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() {
        name = "Dapp University Marketplace";
        owner = msg.sender;
    }

    function createProduct(string memory _name, uint _price) public {
        //Require a name
        require(bytes(_name).length > 0, "Enter a valid name");
        //Requiere a valid price
        require(_price > 0, "Enter a valid price");
        //Increment product count
        productCount++;
        //Create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false, true);
        //Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function changeProductPrice(uint _id, uint _price) public {
        // Fetch the product and make a copy of it
        Product memory _product = products[_id];

        //Make sure the product has valid id
        require(_product.id > 0 && _product.id <= productCount, "Enter valid id");
        //Make sure only owners can edit the value
        require(_product.owner == msg.sender, "Only product owner can change the price");
        //Requiere a valid price
        require(_price > 0, "Enter a valid price");

        products[_id].price = _price;
    }

    function purchaseProduct(uint _id) public payable {
        //Fetch the product and make a copy of it
        Product memory _product = products[_id];
        //Fetch the owner
        address payable _seller = _product.owner;
        //Make sure the product has valid id
        require(_product.id > 0 && _product.id <= productCount, "Enter valid id");
        //Require that there is enough Ether in the transaction
        require(msg.value >= _product.price,"Transfer the correct amount");
        //Require that the product has not been purchased already
        require(!_product.purchased, "Product has been purchased");
        //Require that the buyer is not the seller
        require(msg.sender != _seller, "Buyer cannot be seller");
        //Transfer ownership to the buyer
        _product.owner = msg.sender;
        //Mark as purchased
        _product.purchased = true;
        //Update the product
        products[_id] = _product;

        uint platformTaxAmount = msg.value.mul(platformTax.div(100));
        uint sellerAmount = msg.value.sub(platformTaxAmount);

        //Pay the seller by sending them Ether
        payable(_seller).transfer(sellerAmount);
        //Pay the platform owner the tax amount
        payable(owner).transfer(platformTaxAmount);

        //Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
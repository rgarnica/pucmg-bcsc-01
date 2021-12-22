pragma solidity ^0.5.0;

contract Marketplace {
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

    event ProductPriceChanged (
        uint id,
        uint price
    );

    event ProductStatusChanged (
        uint id,
        bool isForSelling
    );

    constructor() public {
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

        emit ProductPriceChanged(_id, _price);
    }

    function changeProductStatusForSelling(uint _id, bool _isForSelling) public {
        // Fetch the product and make a copy of it
        Product memory _product = products[_id];

        //Make sure the product has valid id
        require(_product.id > 0 && _product.id <= productCount, "Enter valid id");
        //Make sure only owners can edit the value
        require(_product.owner == msg.sender, "Only product owner can change the status");

        products[_id].isForSelling = _isForSelling;

        emit ProductStatusChanged(_id, _isForSelling);
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
        //Require that the buyer is not the seller
        require(msg.sender != _seller, "Buyer cannot be seller");
        //Require that the status is available for selling
        require(_product.isForSelling, "Product is not available for selling");

        //Transfer ownership to the buyer
        _product.owner = msg.sender;
        //Mark as purchased
        _product.purchased = true;
        //Update the product
        products[_id] = _product;

        //Pay the seller by sending them Ether
        address(_seller).transfer(msg.value * 95/100);
        //Pay the platform owner the tax amount
        address(owner).transfer(msg.value * 5/100);

        //Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
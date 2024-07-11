// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplyChain is Ownable {
    enum SupplyChainStatus { Created, InTransit, Delivered }

    struct Item {
        uint256 itemId;
        address manufacturer;
        address transporter;
        address retailer;
        string description;
        SupplyChainStatus status;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemStatusChanged(uint256 indexed itemId, SupplyChainStatus status);

    function createItem(address _manufacturer, string memory _description) public onlyOwner returns (uint256) {
        itemCount++;
        items[itemCount] = Item({
            itemId: itemCount,
            manufacturer: _manufacturer,
            transporter: address(0),
            retailer: address(0),
            description: _description,
            status: SupplyChainStatus.Created
        });
        return itemCount;
    }

    function updateItemStatus(uint256 _itemId, SupplyChainStatus _status) public {
        require(_itemId <= itemCount && _itemId > 0, "Invalid item ID");
        require(_status > items[_itemId].status, "Status must be updated sequentially");

        if (_status == SupplyChainStatus.InTransit) {
            require(msg.sender == items[_itemId].manufacturer, "Only manufacturer can update to InTransit");
            items[_itemId].status = _status;
            items[_itemId].transporter = msg.sender;
        } else if (_status == SupplyChainStatus.Delivered) {
            require(msg.sender == items[_itemId].transporter, "Only transporter can update to Delivered");
            items[_itemId].status = _status;
            items[_itemId].retailer = msg.sender;
        }

        emit ItemStatusChanged(_itemId, _status);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenSwapPlatform is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public admin;
    mapping(address => mapping(address => uint256)) public balances;

    event TokensSwapped(address indexed user, address indexed tokenIn, uint256 amountIn, address indexed tokenOut, uint256 amountOut);

    constructor() {
        admin = msg.sender;
    }

    function swapTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut
    ) external nonReentrant {
        require(tokenIn != tokenOut, "Cannot swap the same token");

        // Transfer tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Perform token swap logic (simple example, adjust as per needs)
        uint256 amountToReceive = (amountIn * amountOut) / amountIn;

        // Transfer tokens to user
        IERC20(tokenOut).safeTransfer(msg.sender, amountToReceive);

        emit TokensSwapped(msg.sender, tokenIn, amountIn, tokenOut, amountToReceive);
    }

    function withdrawTokens(address token, uint256 amount) external {
        require(msg.sender == admin, "Only admin can withdraw");
        IERC20(token).safeTransfer(admin, amount);
    }
}

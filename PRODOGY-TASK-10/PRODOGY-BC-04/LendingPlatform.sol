// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LendingPlatform is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint256 amount;
        uint256 collateralAmount;
        uint256 interestRate; // Per year
        uint256 loanDuration; // In days
        uint256 startDate;
        uint256 repaymentDate;
        uint256 repaymentAmount;
        bool active;
        bool repaid;
        bool collateralized;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCount;

    IERC20 public token; // ERC20 token used for lending

    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function createLoan(
        uint256 _amount,
        uint256 _collateralAmount,
        uint256 _interestRate,
        uint256 _loanDuration
    ) external {
        loanCount++;
        uint256 repaymentAmount = (_amount * _interestRate * _loanDuration) / (365 * 100); // Simple interest

        loans[loanCount] = Loan({
            id: loanCount,
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            collateralAmount: _collateralAmount,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            startDate: block.timestamp,
            repaymentDate: block.timestamp + (_loanDuration * 1 days),
            repaymentAmount: repaymentAmount,
            active: true,
            repaid: false,
            collateralized: false
        });

        emit LoanCreated(loanCount, msg.sender, _amount);

        // Transfer collateral from borrower to the contract
        token.safeTransferFrom(msg.sender, address(this), _collateralAmount);
    }

    function repayLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.active, "Loan is not active");
        require(!loan.repaid, "Loan already repaid");
        require(msg.sender == loan.borrower, "Only borrower can repay the loan");
        require(block.timestamp <= loan.repaymentDate, "Loan repayment date has passed");

        token.safeTransferFrom(msg.sender, address(this), loan.repaymentAmount);

        loan.repaid = true;
        loan.active = false;

        emit LoanRepaid(_loanId, msg.sender, loan.repaymentAmount);
    }

    function collateralizeLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.active, "Loan is not active");
        require(!loan.collateralized, "Loan already collateralized");
        require(msg.sender == loan.borrower, "Only borrower can collateralize the loan");

        loan.collateralized = true;

        // Transfer collateral from borrower to the contract
        token.safeTransferFrom(msg.sender, address(this), loan.collateralAmount);
    }
}

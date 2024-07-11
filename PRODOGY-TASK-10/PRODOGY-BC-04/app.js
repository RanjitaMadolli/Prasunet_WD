import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LendingPlatformContract from './contracts/LendingPlatform.json';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [loanCount, setLoanCount] = useState(0);
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                // Load web3
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    await window.ethereum.enable();
                } else if (window.web3) {
                    const web3Instance = new Web3(window.web3.currentProvider);
                    setWeb3(web3Instance);
                } else {
                    throw new Error('No Ethereum provider detected.');
                }

                // Load user accounts
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);

                // Load smart contract
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = LendingPlatformContract.networks[networkId];
                const lendingPlatformContract = new web3.eth.Contract(
                    LendingPlatformContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setContract(lendingPlatformContract);

                // Load initial loans
                const loanCount = await lendingPlatformContract.methods.loanCount().call();
                setLoanCount(loanCount);

                const loans = [];
                for (let i = 1; i <= loanCount; i++) {
                    const loan = await lendingPlatformContract.methods.loans(i).call();
                    loans.push(loan);
                }
                setLoans(loans);
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        };

        loadBlockchainData();
    }, []);

    const createLoan = async (amount, collateralAmount, interestRate, loanDuration) => {
        try {
            await contract.methods.createLoan(amount, collateralAmount, interestRate, loanDuration).send({ from: accounts[0] });
            alert('Loan created successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error creating loan:', error);
            alert('Failed to create loan. Please try again.');
        }
    };

    const repayLoan = async (loanId) => {
        try {
            await contract.methods.repayLoan(loanId).send({ from: accounts[0] });
            alert('Loan repaid successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error repaying loan:', error);
            alert('Failed to repay loan. Please try again.');
        }
    };

    const collateralizeLoan = async (loanId) => {
        try {
            await contract.methods.collateralizeLoan(loanId).send({ from: accounts[0] });
            alert('Loan collateralized successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error collateralizing loan:', error);
            alert('Failed to collateralize loan. Please try again.');
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <h1>Lending Platform</h1>
            <h2>Create Loan:</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const amount = e.target.elements.amount.value;
                const collateralAmount = e.target.elements.collateralAmount.value;
                const interestRate = e.target.elements.interestRate.value;
                const loanDuration = e.target.elements.loanDuration.value;
                createLoan(amount, collateralAmount, interestRate, loanDuration);
            }}>
                <label>Amount:</label>
                <input type="text" name="amount" required />
                <br />
                <label>Collateral Amount:</label>
                <input type="text" name="collateralAmount" required />
                <br />
                <label>Interest Rate (% per year):</label>
                <input type="text" name="interestRate" required />
                <br />
                <label>Loan Duration (days):</label>
                <input type="text" name="loanDuration" required />
                <br />
                <button type="submit">Create Loan</button>
            </form>

            <h2>Loans:</h2>
            <ul>
                {loans.map(loan => (
                    <li key={loan.id}>
                        <p>Borrower: {loan.borrower}</p>
                        <p>Amount: {loan.amount}</p>
                        <p>Status: {loan.active ? 'Active' : 'Inactive'}</p>
                        {!loan.repaid && (
                            <button onClick={() => repayLoan(loan.id)}>Repay Loan</button>
                        )}
                        {!loan.collateralized && (
                            <button onClick={() => collateralizeLoan(loan.id)}>Collateralize Loan</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TokenSwapPlatformContract from './contracts/TokenSwapPlatform.json';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [tokenIn, setTokenIn] = useState('');
    const [amountIn, setAmountIn] = useState('');
    const [tokenOut, setTokenOut] = useState('');
    const [amountOut, setAmountOut] = useState('');

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
                const deployedNetwork = TokenSwapPlatformContract.networks[networkId];
                const tokenSwapPlatformContract = new web3.eth.Contract(
                    TokenSwapPlatformContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setContract(tokenSwapPlatformContract);
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        };

        loadBlockchainData();
    }, []);

    const handleSwapTokens = async () => {
        try {
            await contract.methods.swapTokens(tokenIn, amountIn, tokenOut, amountOut).send({ from: accounts[0] });
            alert('Tokens swapped successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error swapping tokens:', error);
            alert('Failed to swap tokens. Please try again.');
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <h1>Token Swap Platform</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSwapTokens();
            }}>
                <label>Token In:</label>
                <input type="text" value={tokenIn} onChange={(e) => setTokenIn(e.target.value)} required />
                <br />
                <label>Amount In:</label>
                <input type="text" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} required />
                <br />
                <label>Token Out:</label>
                <input type="text" value={tokenOut} onChange={(e) => setTokenOut(e.target.value)} required />
                <br />
                <label>Amount Out:</label>
                <input type="text" value={amountOut} onChange={(e) => setAmountOut(e.target.value)} required />
                <br />
                <button type="submit">Swap Tokens</button>
            </form>
        </div>
    );
}

export default App;

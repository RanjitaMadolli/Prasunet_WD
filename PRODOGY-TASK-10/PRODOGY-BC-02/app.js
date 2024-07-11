import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NFTContract from './contracts/NFT.json';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [tokenURI, setTokenURI] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [mintedTokens, setMintedTokens] = useState([]);

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
                const deployedNetwork = NFTContract.networks[networkId];
                const nftContract = new web3.eth.Contract(
                    NFTContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setContract(nftContract);

                // Load minted tokens
                const tokenCounter = await nftContract.methods.tokenCounter().call();
                const tokens = [];
                for (let i = 0; i < tokenCounter; i++) {
                    const tokenURI = await nftContract.methods.tokenURI(i).call();
                    tokens.push({ tokenId: i, tokenURI });
                }
                setMintedTokens(tokens);
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        };

        loadBlockchainData();
    }, []);

    const mintNFT = async () => {
        try {
            const receipt = await contract.methods.mintNFT(accounts[0], tokenURI).send({ from: accounts[0] });
            console.log('Transaction receipt:', receipt);
            alert('Successfully minted NFT!');
        } catch (error) {
            console.error('Error minting NFT:', error);
            alert('Failed to mint NFT. Please try again.');
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <h1>NFT Marketplace</h1>
            <h2>Mint NFT</h2>
            <input type="text" placeholder="Enter Token URI" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} />
            <button onClick={mintNFT}>Mint NFT</button>
            <h2>Minted NFTs:</h2>
            <ul>
                {mintedTokens.map(token => (
                    <li key={token.tokenId}>
                        <p>Token ID: {token.tokenId}</p>
                        <p>Token URI: {token.tokenURI}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

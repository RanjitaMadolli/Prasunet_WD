import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SupplyChainContract from './contracts/SupplyChain.json';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [itemCount, setItemCount] = useState(0);
    const [items, setItems] = useState([]);

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
                const deployedNetwork = SupplyChainContract.networks[networkId];
                const supplyChainContract = new web3.eth.Contract(
                    SupplyChainContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setContract(supplyChainContract);

                // Load initial items
                const itemCount = await supplyChainContract.methods.itemCount().call();
                setItemCount(itemCount);

                const items = [];
                for (let i = 1; i <= itemCount; i++) {
                    const item = await supplyChainContract.methods.items(i).call();
                    items.push(item);
                }
                setItems(items);
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        };

        loadBlockchainData();
    }, []);

    const updateItemStatus = async (itemId, newStatus) => {
        try {
            await contract.methods.updateItemStatus(itemId, newStatus).send({ from: accounts[0] });
            alert(`Item ${itemId} status updated to ${newStatus}`);
            window.location.reload();
        } catch (error) {
            console.error(`Error updating item ${itemId} status:`, error);
            alert(`Failed to update item ${itemId} status. Please try again.`);
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <h1>Supply Chain Tracking dApp</h1>
            <h2>Items:</h2>
            <ul>
                {items.map(item => (
                    <li key={item.itemId}>
                        <p>Description: {item.description}</p>
                        <p>Status: {item.status}</p>
                        {item.status === 'Created' && (
                            <button onClick={() => updateItemStatus(item.itemId, 'InTransit')}>
                                Update Status to InTransit
                            </button>
                        )}
                        {item.status === 'InTransit' && (
                            <button onClick={() => updateItemStatus(item.itemId, 'Delivered')}>
                                Update Status to Delivered
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

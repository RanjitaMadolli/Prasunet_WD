import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidateId, setSelectedCandidateId] = useState(0);

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
                const deployedNetwork = VotingContract.networks[networkId];
                const votingContract = new web3.eth.Contract(
                    VotingContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setContract(votingContract);

                // Load candidates
                const candidatesCount = await votingContract.methods.candidatesCount().call();
                const candidates = [];
                for (let i = 1; i <= candidatesCount; i++) {
                    const candidate = await votingContract.methods.candidates(i).call();
                    candidates.push(candidate);
                }
                setCandidates(candidates);
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        };

        loadBlockchainData();
    }, []);

    const voteForCandidate = async () => {
        try {
            await contract.methods.vote(selectedCandidateId).send({ from: accounts[0] });
            alert('Successfully voted!');
        } catch (error) {
            console.error('Error voting:', error);
            alert('Failed to vote. Please try again.');
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <h1>Voting DApp</h1>
            <h2>Candidates:</h2>
            <ul>
                {candidates.map(candidate => (
                    <li key={candidate.id}>
                        {candidate.name} - Votes: {candidate.voteCount}
                    </li>
                ))}
            </ul>
            <h2>Vote for Candidate:</h2>
            <select onChange={(e) => setSelectedCandidateId(e.target.value)}>
                <option value="0">Select candidate...</option>
                {candidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>
                        {candidate.name}
                    </option>
                ))}
            </select>
            <br />
            <button onClick={voteForCandidate}>Vote</button>
        </div>
    );
}

export default App;

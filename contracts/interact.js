document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(window.ethereum);
    const abi = [ { "inputs": [ { "internalType": "string[]", "name": "info", "type": "string[]" } ], "name": "addCandidate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" } ], "name": "addOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "sid", "type": "uint256" } ], "name": "addVoter", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_startTime", "type": "uint256" }, { "internalType": "uint256", "name": "_endTime", "type": "uint256" } ], "name": "editStartEndTimestamp", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "findWinningCandidate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "restart", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "_candidate", "type": "address" } ], "name": "voteCandidate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addr", "type": "address" } ], "name": "checkOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllCandidates", "outputs": [ { "components": [ { "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }, { "internalType": "string[]", "name": "info", "type": "string[]" } ], "internalType": "struct Election.Candidate[]", "name": "_addresses", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllVoters", "outputs": [ { "components": [ { "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "bool", "name": "voted", "type": "bool" }, { "internalType": "uint256", "name": "candidateId", "type": "uint256" }, { "internalType": "uint256", "name": "sid", "type": "uint256" } ], "internalType": "struct Election.Voter[]", "name": "addresses", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getPastWinner", "outputs": [ { "components": [ { "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }, { "internalType": "string[]", "name": "info", "type": "string[]" } ], "internalType": "struct Election.Candidate[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStartEndTime", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getWinningCandidate", "outputs": [ { "components": [ { "internalType": "address", "name": "addr", "type": "address" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }, { "internalType": "string[]", "name": "info", "type": "string[]" } ], "internalType": "struct Election.Candidate[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" } ]
    const contractAddrHolesky = "0x8A344f6b36fc3d6Ef96ed8b0Df19c8efa5BaB94D";   // In holesky
    const contractAddrSepolia = "0xd53E487c319265aB35553f735DCa065422E101be";   // In sepolia (Not updated)
    const contractAddrDict = {"Holesky": contractAddrHolesky, "Sepolia": contractAddrSepolia};
    let contractAddr;

    let myContract;
    let account;


        
    const radios = document.getElementsByName("chain");
    function selectChain() {
        for (let radio of radios)  {
            if (radio.checked) {
                contractAddr = contractAddrDict[radio.value];
                console.log(radio.value);
                myContract = new web3.eth.Contract(abi, contractAddr);
                console.log("Switch to " + radio.value);
            }
        }
    }

    radios.forEach(radio => {
        radio.addEventListener("change", selectChain);
    });

    selectChain();    

    document.getElementById("connectButton").addEventListener("click", async() => {

        const networkId = await web3.eth.net.getId(); 
        console.log("Connected to :", networkId);
        if (networkId == 17000n) {
            contractAddr = contractAddrHolesky;
        }
        else if (networkId == 11155111n) {
            contractAddr = contractAddrSepolia;
        }

        if (typeof window.ethereum === "undefined") {
            console.log("MetaMask is not installed. Please install it to use this app.");
        }
        else {
            console.log("MetaMask is installed!");
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log("Connected account:", accounts[0]);
                account = accounts[0];
            }
            catch (e) {
                console.error(e);
            }
        }
    });

    document.getElementById("addOwner").addEventListener("click", async() => {
        try {
            const addr = document.getElementById("ownerAddr").value;
            await myContract.methods.addOwner(addr).estimateGas({from: account});
            await myContract.methods.addOwner(addr).send({from: account})
                .on("receipt", function() {
                    console.log("Done");
                });
        }
        catch (e) {
            console.log(e.data.message);
        }
    });

    document.getElementById("checkOwner").addEventListener("click", async() => {
        const addr = document.getElementById("checkIsAddr").value;
        const result = await myContract.methods.checkOwner(addr).call();
        console.log(result);
    });

    document.getElementById("restart").addEventListener("click", async () => {
        try {
            await myContract.methods.restart().estimateGas({from: account});
            await myContract.methods.restart().send({from: account})
                .on("receipt", function() {
                    console.log("Done");
                })
        }
        catch (e) {
            console.log(e.data.message);
        }
    });

    document.getElementById("addVoter").addEventListener("click", async() => {
        try {
            const sid = document.getElementById("voterSID").value;
            await myContract.methods.addVoter(sid).estimateGas({from: account})
            await myContract.methods.addVoter(sid).send({from: account})
                .on("receipt", function() {
                    console.log("Done");
                });
        }
        catch (e) {       
            console.log(e.data.message);
        }
    });

    document.getElementById("addCandidate").addEventListener("click", async() => {
        try {
            const info = document.getElementById("candidateInfo").value.split(", ");
            await myContract.methods.addCandidate(info).estimateGas({from: account})
            await myContract.methods.addCandidate(info).send({from: account})
                .on("receipt", function() {
                    console.log("Done");
                });
        }
        catch (e) {
            console.log(e.data.message);
        }
    });

    document.getElementById("getAllVoter").addEventListener("click", async() => {
        const result = await myContract.methods.getAllVoters().call();
        console.log(result);
    });

    document.getElementById("getAllCandidate").addEventListener("click", async() => {
        const result = await myContract.methods.getAllCandidates().call();
        console.log(result);
    });

    document.getElementById("editTime").addEventListener("click", async() => {
        try {
            const startTime = document.getElementById("startTime").value;
            const endTime = document.getElementById("endTime").value;
            await myContract.methods.editStartEndTimestamp(startTime,endTime).estimateGas({from: account});
            await myContract.methods.editStartEndTimestamp(startTime,endTime).send({from: account})
                .on("receipt", function() {
                    console.log("Done");
                });
        }
        catch (e) {
            console.log(e.data.message);
        }
    });

    document.getElementById("getTime").addEventListener("click", async() => {
        const result = await myContract.methods.getStartEndTime().call();
        console.log(result);
    })


    document.getElementById("vote").addEventListener("click", async() => {
        try {
            const address = document.getElementById("candidateAddress").value;
            await myContract.methods.voteCandidate(address).estimateGas({from: account});
            await myContract.methods.voteCandidate(address).send({from: account})
                .on("receipt", function() {
                    console.log("Done");
                });
        }
        catch (e) {
            console.log(e.data.message);
        }
    });

    document.getElementById("calWin").addEventListener("click", async() => {
        try {
            await myContract.methods.findWinningCandidate().estimateGas({from: account});
            await myContract.methods.findWinningCandidate().send({from: account})
                .on("receipt", async function() {
                    console.log("Done");
                });
        }
        catch (e) {
            console.log(e.data.message);
        }
    });

    document.getElementById("getWin").addEventListener("click", async() => {
        try {
            await myContract.methods.getWinningCandidate().estimateGas({from: account});
            const result = await myContract.methods.getWinningCandidate().call();
            console.log(result);
        }
        catch (e) {
            console.log(e);
            console.log(e.data.message);
        }
    });

    document.getElementById("getPastWin").addEventListener("click", async() => {
        const result = await myContract.methods.getPastWinner().call();
        console.log(result);
    });
    

});
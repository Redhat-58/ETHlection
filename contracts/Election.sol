// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Election {
    struct Candidate {
        address addr;
        uint votes;
        string[] info;      // name, year, college, major, description
    }

    struct Voter {
        address addr;
        bool voted;
        uint candidateId;
        uint sid;
    }

    uint numCandidates = 0;
    uint numVoters = 0;

    mapping(address => uint) candidateId;   // index = Id - 1
    mapping(address => uint) voterId;       // index = Id - 1
    mapping(uint => uint) sidMap;
    
    uint winnerId;

    uint startTime = 0;
    uint endTime = 0;

    bool started;
    bool finished;
    bool timeEdited = false;

    Candidate[] candidates;
    Voter[] voters;

    Candidate[] maxCandidate;
    bool winnerFound = false;
    Candidate[] pastWinner;

    address[] owner;

    constructor() {
        winnerId = 0;
        started = false;
        owner.push(msg.sender);
    }

    // Restart election, need owner, will not reset pastWinner
    function restart() external {
        require(checkOwner(msg.sender), "Only owner can restart");
        winnerId = 0;
        started = false;
        finished = false;
        startTime = 0;
        endTime = 0;
        timeEdited = false;
        winnerFound = false;
        for (uint i = 0; i < numCandidates; i++) {
            candidateId[candidates[i].addr] = 0;
        }
        for (uint i = 0; i < numVoters; i++) {
            voters[i].voted = false;
            voters[i].candidateId = 0;
        }
        numCandidates = 0;
        delete candidates;
        delete maxCandidate;
    }

    // Check if message sender is owner
    function checkOwner(address addr) public view returns (bool) {
        for (uint i = 0; i < owner.length; i++) {
            if (owner[i] == addr) {
                return true;
            }
        }
        return false;
    }

    // Add address to owner
    function addOwner(address addr) external {
        require(checkOwner(msg.sender), "Not owner");
        owner.push(addr);
    }

    // Check if voting time started
    function checkStart() private returns (bool) {
        if (started)
            return true;
        if (!timeEdited)
            return false;
        started = block.timestamp > startTime;
        return started;
    }

    // Check if voting time ended
    function checkFinish() private returns (bool) {
        if (finished)
            return true;
        finished = block.timestamp > endTime;
        return finished;
    }

    function validSid(uint sid) private pure returns (bool) {
        if (sid < 1000000000 || sid > 9999999999) {
            return false;
        }
        return true;
    }

    // Add message sender as one of the candidate
    function addCandidate(string[] memory info) external {
        // require(!checkStart(), "Already started");
        require(voterId[msg.sender] > 0, "Please apply as voter first");
        require(candidateId[msg.sender] == 0, "Candidate already added");
        candidates.push(Candidate(msg.sender, 0, info));
        numCandidates += 1;
        candidateId[msg.sender] = numCandidates;
    }

    // Add message sender as voter
    function addVoter(uint sid) external {
        // require(!checkStart(), "Already started");
        require(validSid(sid), "SID is not valid");
        require(sidMap[sid] == 0, "SID already linked to another account");
        require(voterId[msg.sender] == 0, "Voter already added");
        voters.push(Voter(msg.sender, false, 0, sid));
        numVoters += 1;
        voterId[msg.sender] = numVoters;
        sidMap[sid] = numVoters;
    }

    // Edit the start and end time of voting, need owner
    // input format is timestamp, which only contains number
    function editStartEndTimestamp(uint _startTime, uint _endTime) external {
        require(checkOwner(msg.sender), "Only owner can edit");
        require(!checkStart(), "Already started");
        startTime = _startTime;
        endTime = _endTime;
        timeEdited = true;
    }

    // Get start/end time
    function getStartEndTime() view external returns (uint, uint){
        return (startTime, endTime);
    }

    // Allow voter vote
    function voteCandidate(address _candidate) external {
        require(checkStart(), "Election is not started");
        require(!checkFinish(), "Election has already finished");
        require(candidateId[_candidate] > 0, "Candidate do not exist");
        // require(candidateId[msg.sender] == 0, "Only voters can cast vote");
        require(voterId[msg.sender] > 0, "Voter is not added in the election");
        Voter storage voter = voters[voterId[msg.sender] - 1];
        require(!voter.voted, "Voter has already cast its vote");
        voter.candidateId = candidateId[_candidate];
        voter.voted = true;
        Candidate storage candidate = candidates[candidateId[_candidate] - 1];
        candidate.votes += 1;
    }

    // Get all candidate
    function getAllCandidates() external view returns (Candidate[] memory _addresses) {
        _addresses = new Candidate[](candidates.length);
        for(uint i = 0; i < candidates.length; i ++) {
            _addresses[i] = candidates[i];
        }
    }

    // Get all voter
    function getAllVoters() external view returns (Voter[] memory addresses) {
        addresses = new Voter[](voters.length);
        for (uint i = 0; i < voters.length; i++) {
            addresses[i] = voters[i];
        }
    }

    // Find the winner and store them in an array, can be more than one winner
    function findWinningCandidate() external {
        require(checkFinish(), "The election is still running");
        delete maxCandidate;
        uint maxVote = 0;
        for (uint i = 0; i < numCandidates; i++) {
            if (candidates[i].votes > maxVote) {
                delete maxCandidate;
                maxVote = candidates[i].votes;
                maxCandidate.push(candidates[i]);
            }
            else if ((candidates[i].votes == maxVote)) {
                maxCandidate.push(candidates[i]);
            }
        }
        if (!winnerFound) {
            for (uint i = 0; i < maxCandidate.length; i++) {
                pastWinner.push(maxCandidate[i]);
            }
        }
        winnerFound = true;
    }

    // Get the winner
    function getWinningCandidate() external view returns(Candidate[] memory) {
        require(winnerFound, "Need to find winner first");
        Candidate[] memory temp = new Candidate[](maxCandidate.length);
        for (uint i = 0; i < maxCandidate.length; i++) {
            temp[i] = maxCandidate[i];
        }
        return temp;
    }

    // Get past winner
    function getPastWinner() external view returns(Candidate[] memory) {
        return pastWinner;
    }
}
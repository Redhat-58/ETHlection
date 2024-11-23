// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Election {
    struct Candidate {
        address addr;
        uint votes;
        bool agreeTime;
        string info;
    }

    struct Voter {
        address addr;
        bool eligible;
        bool voted;
        uint candidateId;

        address[] whitelistedBy;
        uint whitelistCount;
        string info;
    }

    uint numCandidates = 0;
    uint numVoters = 0;

    mapping(address => uint) candidateId;   // index = Id - 1
    mapping(address => uint) voterId;       // index = Id - 1
    
    uint winnerId;

    uint startTime = 0;
    uint endTime = 0;

    bool started;
    bool finished;

    Candidate[] candidates;
    Voter[] voters;

    Candidate[] maxCandidate;

    address owner;

    constructor() {
        winnerId = 0;
        started = false;
        owner = msg.sender;
    }

    // Restart election
    function restart() external {
        require(msg.sender == owner, "Only owner can restart");
        winnerId = 0;
        started = false;
        finished = false;
        startTime = 0;
        endTime = 0;
        for (uint i = 0; i < numCandidates; i++) {
            candidateId[candidates[i].addr] = 0;
        }
        for (uint i = 0; i < numVoters; i++) {
            voterId[voters[i].addr] = 0;
        }
        numCandidates = 0;
        numVoters = 0;
        delete candidates;
        delete voters;  
        delete maxCandidate;
    }

    // Check if voting time started
    function checkStart() private returns (bool) {
        if (started)
            return true;
        for (uint i = 0; i < numCandidates; i++) {
            if (!candidates[i].agreeTime)
                return false;
        }
        if (numCandidates == 0)
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

    // Add message sender as one of the candidate
    function addCandidate(string memory info) external {
        require(!checkStart(), "Already started");
        require(candidateId[msg.sender] == 0, "Candidate already added");
        candidates.push(Candidate(msg.sender, 0, false, info));
        numCandidates += 1;
        candidateId[msg.sender] = numCandidates;

        // All voters become not eligible to vote
        for (uint i = 0; i < numVoters; i++) {
            voters[i].eligible = false;
        }
    }

    // Add message sender as voter
    function addVoter(string memory info) external {
        require(!checkStart(), "Already started");
        require(voterId[msg.sender] == 0, "Voter already added");
        voters.push(Voter(msg.sender, false, false, 0, new address[](0), 0, info));
        numVoters += 1;
        voterId[msg.sender] = numVoters;
    }

    // Edit the start and end time of voting, it will apply only when all candidates agree
    // input format is timestamp, which only contains number
    function editStartEndTimestamp(uint _startTime, uint _endTime) external {
        require(candidateId[msg.sender] > 0, "Only candidate can change start/end time");
        require(!checkStart(), "Already started");
        startTime = _startTime;
        endTime = _endTime;
        for (uint i = 0; i < numCandidates; i++) {
            candidates[i].agreeTime = false;
        }
    }

    // Get start/end time
    function getStartEndTime() view external returns (uint, uint){
        return (startTime, endTime);
    }

    // Allow message sender (candidate) to agree start/end time
    function agreeStartEndTime() external {
        require(candidateId[msg.sender] > 0, "Only candidate can agree start/end time");
        require(endTime != 0, "Start/end time has not been edited");
        require(!checkStart(), "Already started, cannot change time.");
        candidates[candidateId[msg.sender] - 1].agreeTime = true;
    }

    // For candidates to whitelist voters
    function whitelistVoter(address[] memory _voters) external {
        require(!finished, "Election has already finished");
        require(candidateId[msg.sender] > 0, "Only candidate can whitelist the voter");

        for (uint j = 0; j < _voters.length; j++) {
            address _voter = _voters[j];
            require(voterId[_voter] > 0, "Voter is not added");
            Voter storage voter = voters[voterId[_voter] - 1];
            require(!voter.eligible, "Voter is already eligible to vote");
            for(uint i = 0; i < voter.whitelistCount; i ++) {
                require(msg.sender != voter.whitelistedBy[i], "Voter has already been whitelisted by you");
            }
            voter.whitelistedBy.push(msg.sender);
            voter.whitelistCount += 1;
            if (voter.whitelistCount == numCandidates) {
                voter.eligible = true;
            }
        }
    }

    // Allow voter vote
    function voteCandidate(address _candidate) external {
        require(checkStart(), "Election is not started");
        require(!checkFinish(), "Election has already finished");
        require(candidateId[_candidate] > 0, "Candidate do not exist");
        // require(candidateId[msg.sender] == 0, "Only voters can cast vote");
        require(voterId[msg.sender] > 0, "Voter is not added in the election");
        Voter storage voter = voters[voterId[msg.sender] - 1];
        require(voter.eligible, "Voter is not yet eligible to cast vote");
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
    }

    // Get the winner
    function getWinningCandidate() external view returns(Candidate[] memory) {
        Candidate[] memory temp = new Candidate[](maxCandidate.length);
        for (uint i = 0; i < maxCandidate.length; i++) {
            temp[i] = maxCandidate[i];
        }
        return temp;
    }

}
pragma solidity ^0.8.0;

contract Voter {
    uint internal candidateCount = 0;

    struct Candidate{
        string name;
        string image;
        uint count;
    }

    mapping (uint => Candidate) internal candidates;

    function addCandidate(
        string memory _name,
        string memory _image
    ) public {
        uint count = 0;
        candidates[candidateCount] = Candidate(
            _name,
            _image,
            _count
        );
        candidateCount++
    }

    function displayCandidate(uint _index) public view returns(
        string memory,
        string memory,
        uint
    ){
        return(
            candidates[_index].name,
            candidates[_index].image,
            candidates[_index].count
        )
    }

    function castVote(uint _index) public {
        candidates[_index].count++
    }

    function getCandidateCount() public view returns(uint){
        return candidateCount;
    }
}
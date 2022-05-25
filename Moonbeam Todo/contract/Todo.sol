pragma solidity ^0.8.0;

contract Todo {
    uint public count = 0;

    struct Task {
        uint id;
        string content;
    }
    mapping (uint => Task) public tasks;

    function createTask(string memory _content) public {
        count++;
        tasks[count] = Task(count, _content);
    }

    function viewTask(uint _id) public view returns (string memory){
        return(
            tasks[_id].content
        );
    }

    function getCount() public view returns(uint){
        return count;
    }

}
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract GuessAndWin is Ownable {

    struct Player {
        bool isRegistered;
        uint8 tries;
        string proposedWord;
    }

    address admin;

    mapping(uint => mapping(address => Player)) private games;
    uint private currentGame;

    string private word;
    string private indice;
    
    event PlayerWon(address _player, string _word);
    event GameRestarted(address _admin);

    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyPlayer() {
        require(games[currentGame][msg.sender].isRegistered, 'Caller is not registered player');
        _;
    }

    function newPlayer() external {
        require(games[currentGame][msg.sender].isRegistered == false, 'Player already registered');
        games[currentGame][msg.sender] = Player(true, 0, '');
    }

    function defineWordAndIndice(string memory _word, string memory _indice) external onlyOwner {
        word = _word;
        indice = _indice;
    }

    function getIndice() external view onlyPlayer returns (string memory) {
        return indice;
    }

    function proposeWord(string memory _word) external onlyPlayer returns (bool) {
        require(games[currentGame][msg.sender].tries < 3, 'Player already tried 3 times');
        games[currentGame][msg.sender].tries++;
        games[currentGame][msg.sender].proposedWord = _word;
        bool correct = keccak256(abi.encodePacked(_word)) == keccak256(abi.encodePacked(word));
        if (correct) {
            emit PlayerWon(msg.sender, word);
        }
        return correct;
    }

    function newGame(address _newAdmin) external onlyOwner {
        admin = _newAdmin;
        currentGame++;
        emit GameRestarted(_newAdmin);
    }

}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StudentNFT is ERC721URIStorage, Ownable {
    address public admin;
    uint256 private tokenIdCounter;

    struct tokenValidation {
        uint256 tokenID;
        uint256 expirationtime;
    }
    mapping(address => uint256) public StudentsToken;
    mapping(address => uint256) public StudentsScore;
    mapping(uint256 => tokenValidation) public TokenValidation;

    constructor() ERC721("Stukey", "STUK") {
        admin = msg.sender;
        tokenIdCounter = 0;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(from == address(0), "Err: token transfer is BLOCKED");
        super._beforeTokenTransfer(from, to, tokenId);
    }


    function getTokenUri(uint256 _score) internal pure returns (string memory) {
        if (_score <= 10) {
            return
                "https://intimate-green-gerbil.myfilebase.com/ipfs/QmRSLLcKcMihsqoR29M3hQEjF7vPmL7APbUb1DEq6JPSbx";
        } else if (_score >= 11 && _score <= 30) {
            return
                "https://intimate-green-gerbil.myfilebase.com/ipfs/Qmc4m8GQybs9AyUP9HD2pQjDaXwWQ6vjebycA3GuTRKCpo";
        } else if (_score >= 31 && _score <= 80) {
            return
                "https://intimate-green-gerbil.myfilebase.com/ipfs/QmUmodMbrVqY3jSSJJiUqCeC6Vos4RoqnxZdDGQFDemjWK";
        } else {
            return
                "https://intimate-green-gerbil.myfilebase.com/ipfs/QmTYLn7hnKENWP3Vj6k11xwnXT5N866YbqBQAZsPrQMhrh";
        }
    }

    function mintNFT(
        address _studentAddress,
        uint256 _score,
        uint256 validityPeriod
    ) external onlyOwner {
        tokenIdCounter++;
        _mint(_studentAddress, tokenIdCounter);
        string memory _uri = getTokenUri(_score);
        _setTokenURI(tokenIdCounter, _uri);
        StudentsToken[_studentAddress] = tokenIdCounter;
        StudentsScore[_studentAddress] = _score;
        uint256 expirationTime = block.timestamp + validityPeriod;
        TokenValidation[tokenIdCounter] = tokenValidation({
            tokenID: tokenIdCounter,
            expirationtime: expirationTime
        });
    }

    function getStudentScore_or_nftID(
        address _studentAddress
    ) external view returns (uint256 _tokenIds, uint256 _score) {
        return (StudentsToken[_studentAddress], StudentsScore[_studentAddress]);
    }
    function updateEngageScore(
        address _studentAddress,
        uint256 _newScore
    ) external onlyOwner {
        StudentsScore[_studentAddress] = _newScore;
        uint256 tokenId = StudentsToken[_studentAddress];
        if (tokenId != 0) {
            // Ensure the student has a token
            string memory newUri = getTokenUri(_newScore);
            _setTokenURI(tokenId, newUri);
        }
    }
}

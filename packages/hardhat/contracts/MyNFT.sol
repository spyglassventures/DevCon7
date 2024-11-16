// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARD-CODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract MyNFT is ERC721URIStorage, Ownable {
    // A constant URL pointing to the metadata for the token on IPFS (InterPlanetary File System).
    string constant TOKEN_URI = "https://ipfs.io/ipfs/QmYuKY45Aq87Le1R5dhb1hqHLp6ZFbJaCP8jxqKM1MX6y/babe_ruth_1.json";

    // Internal variable to keep track of the latest token ID issued.
    uint256 internal tokenId;

    // Constructor for the contract, initializing it with a name, symbol, and setting the owner.
    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    // A function to mint a new NFT. Can only be called by the owner of the contract.
    function mint(address to) public onlyOwner {
        // Minting a new NFT to the specified address with the current tokenId.
        _safeMint(to, tokenId);

        // Setting the URI for the newly minted token to point to the IPFS metadata.
        _setTokenURI(tokenId, TOKEN_URI);

        // Incrementing the tokenId for the next mint. The unchecked block is used to suppress
        // overflow checks, which are not needed in this context.
        unchecked {
            tokenId++;
        }
    }
}


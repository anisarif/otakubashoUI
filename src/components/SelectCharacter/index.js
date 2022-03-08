import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import OtakuGame from '../../utils/OtakuGame.json';
/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  const [ characters, setCharacters ] = useState([]);
  const[gameContract, setGameContract]= useState(null);

  // Actions
  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
  
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        OtakuGame.abi,
        signer
      );
  
      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
  
        /*
         * Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);
  
        /*
         * Go through all of our characters and transform the data
         */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );
  
        /*
         * Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };
    
     /*
      * Add a callback method that will fire when this event is received
      */
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

    /*
     * Once our character NFT is minted we can fetch the metadata from our contract
     * and set it in state to move onto the Arena
     */
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log('CharacterNFT: ', characterNFT);
      setCharacterNFT(transformCharacterData(characterNFT));
    }
    };
    /*
     * If our gameContract is ready, let's get characters!
     */
    if (gameContract) {
      getCharacters();
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }


    return () => {
      /*
      * When your component unmounts, let;s make sure to clean up this listener
      */
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };
  }, [gameContract, setCharacterNFT]);
  

  const renderCharacters = () =>
      characters.map((character, index) => (
        <div className="" key={character.name}>
          <img className="flex flex-col w-[360px] h-[360px] rounded-3xl" src={character.imageURI} alt={character.name}/>     
          <button onClick={()=> mintCharacterNFTAction(index)} className="font-bold bg-pink-300 rounded-3xl text-black p-7 my-5 mt-20 text-2xl w-[360px] ">{`MINT ${character.name}`}</button> 
        </div>
  ));


  return (
    <div className="flex flex-col place-content-center mr-40">
    {characters.length > 0 && (
      <div >
        {renderCharacters()}
      </div>
    )}
    </div>
    );
  
    }
export default SelectCharacter;
import React, {useEffect, useState} from "react"
import otakuGirl from "../../images/Otaku2.png"
import SelectCharacter from "../SelectCharacter"
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants'
import OtakuGame from '../../utils/OtakuGame.json'
import { ethers } from "ethers"
import Arena from "../Arena"




const MintPage = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

       /// State

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /// Actions

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkNetwork = async () => {
    try { 
      if (window.ethereum.networkVersion !== '4') {
        alert("Please connect to Rinkeby!")
      }
    } catch(error) {
      console.log(error)
    }
  };

  useEffect(() => {
    /*
     * Function for interaction with the smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        OtakuGame.abi,
        signer
      );
  
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
    };
  
    /*
     * run this only if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  const renderContent = () => {
    if (currentAccount && !characterNFT) {
      return (
        <div className="flex h-screen">
            <SelectCharacter setCharacterNFT={setCharacterNFT} />
        </div> 
    );
     
    } else if (currentAccount && characterNFT) {
      return (
        <div className="flex h-screen">
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
        </div>
      );
    }
  };


  return (
    <main className="flex flex-col h-full bg-black px-40">
      <title>Mint Page</title>
        {renderContent()}
      <img className="fixed right-40 h-screen px-2 m-4" src={otakuGirl} alt="otaku girl"/>
    </main>
  ) 
}

export default MintPage

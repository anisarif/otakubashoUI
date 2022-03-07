import React, {useEffect, useState} from "react"
import TypeWriterEffect from 'react-typewriter-effect'
import otakuGirl from "../../images/Otaku2.png"
import { Link } from "react-router-dom"




const Homepage = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

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

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderContent = () => {
    if (!currentAccount) {
      return (
        <button onClick={connectWalletAction} className=" mb-40 mx-10 font-bold bg-pink-300 rounded-3xl text-black p-5  mt-20 text-2xl ">CONNECT WALLET </button>
      );
    } else {
      return (
        <Link to='/MintPage'>
        <button className=" mx-10 mb-40 font-bold bg-pink-300 rounded-3xl text-black p-5  mt-10 text-2xl ">MINT YOUR NFT NOW !</button>
        <div className="m-20"/>
        </Link>
      );
    }
  };


  return (
    <main className=" justify-around w-full h-full bg-black bg-cover pl-40 flex flex-row">
      <title>Home Page</title>
      <div className="mt-40 overflow-y-auto flex flex-col">
        <h1 className="text-white text-5xl my-10 p-25 flex">Welcome to</h1>
        <h1 className="text-pink-300 text-9xl mb-2 font-['Ungai']">Otaku</h1>
        <h1 className="text-white text-9xl font-['Ungai']">Basho</h1>
        <div className="text-white text-2xl my-10">

          <TypeWriterEffect 
            startDelay={1000}
            cursorColor="#FFC0CB"
            multiText={[
              "The first Web3 Anime Plateform",
              "By Otakus, For Otakus",
              "Decentralised",
              "Owned by the community",
              "Let's build it together !",

            ]}
            loop={true}
            multiTextDelay={1000}
            typeSpeed={30}
            />
        </div>
        {renderContent()}
      </div>
      <div className="relative">
        <img className="fixed right-40 h-screen px-2 m-4" src={otakuGirl} alt="otaku girl"/>
      </div>
    </main>
  )
}

export default Homepage

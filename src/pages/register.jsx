import React, { useEffect, useState } from 'react';
import otakuGirl from "./images/Otaku2.png"



const Register = () => {

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

  return (
    <main className="flex justify-evenly h-full bg-black px-40">
        <title>Register</title>
        <button className="font-bold bg-pink-300 text-black p-10 my-40 text-2xl " onClick={connectWalletAction}>
            Connect Wallet To Get Started
        </button>
      <img className="h-screen px-2 m-4" src={otakuGirl} alt="otaku girl"/>
    </main>
  )
}

export default Register

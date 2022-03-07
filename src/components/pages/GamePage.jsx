import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import OtakuGame from '../../utils/OtakuGame.json';

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const GamePage = ({ characterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  /*
   * State that will hold our boss metadata
  */
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState('');


  // Actions
  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('attacking');
        console.log('Attacking boss...');
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');
      }
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
    }
  };

  // UseEffects
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

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    };

  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss();
    console.log('Boss:', bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };

  if (gameContract) {
    /*
     * gameContract is ready to go! Let's fetch our boss
     */
    fetchBoss();
  }
}, [gameContract]);

  

  return (
    <div className=" flex flex-col justify-around bg-black bg-full">
    {/* Replace your Boss UI with this */}
    {boss && (
          <div className="text-white">
            <div className="">
              <h2 className="text-white">🔥 {boss.name} 🔥</h2>
              <div className="">
                <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                <div className="">
                  <progress className="text-white" value={boss.hp} max={boss.maxHp} />
                  <p className="text-white">{`${boss.hp} / ${boss.maxHp} HP`}</p>
                </div>
              </div>
            </div>
            <div className="">
              <button className="text-white" onClick={runAttackAction}>
                {`💥 Attack ${boss.name}`}
              </button>
            </div>
          </div>
        )}
      {characterNFT && (
        <div className="">
          <h2>Your Character</h2>
          <div className="">
            <div className="">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      )}

  </div>
  );
};

export default GamePage;
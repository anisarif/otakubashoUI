import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import OtakuGame from '../../utils/OtakuGame.json';

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // State
    const [gameContract, setGameContract] = useState(null);
    
  /*
   * State that will hold our boss metadata
   */
    const [boss, setBoss] = useState(null);
    /*
    * State attack
    */
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
    const onAttackComplete = (newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * Update both player and boss Hp
        */
        setBoss((prevState) => {
            return { ...prevState, hp: bossHp };
        });

        setCharacterNFT((prevState) => {
            return { ...prevState, hp: playerHp };
        });
    };

    if (gameContract) {
        fetchBoss();
        gameContract.on('AttackComplete', onAttackComplete);
    }

    /*
    * Make sure to clean up this event when this component is removed
    */
    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
}, [gameContract, setCharacterNFT]);


    
  return (
    <div className=" flex flex-col h-screen justify-center bg-black bg-full">
    {boss && (
          <div className="text-white">
            <div className="">
              <h2 className="text-white">🔥 {boss.name} 🔥</h2>
              <div className="">
                <img className='w-[360px] h-[360px] rounded-3xl'
                src={boss.imageURI} alt={`Boss ${boss.name}`} />
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
        <div className="flex flex-col h-screen justify-center bg-black bg-full text-white">
          <div className="">
            <div className="">
              <h2>{characterNFT.name}</h2>
              <img className='w-[360px] h-[360px] rounded-3xl'
                src={characterNFT.imageURI} alt={`Character ${characterNFT.name}`}/>
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
      }

export default Arena;
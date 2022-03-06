import React from "react"
import TypeWriterEffect from 'react-typewriter-effect'
import otakuGirl from "./images/Otaku2.png"




const IndexPage = () => {
  return (
    <main className="flex justify-evenly h-full bg-black px-40">
      <title>Home Page</title>
      <div className=" pt-40">
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
          <button className=" font-bold bg-pink-300 rounded-3xl text-black p-5  mt-20 text-2xl ">REGISTER NOW </button>
      </div>
      <img className="h-screen px-2 m-4" src={otakuGirl} alt="otaku girl"/>
    </main>
  )
}

export default IndexPage

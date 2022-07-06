import React, { useState } from 'react'
import { keyPairFromSeed } from 'watsign';
import { toUrl } from 'fast-base64/url'
import { toBase64 } from 'fast-base64/js';
import jamjpg from '../img/jam.jpg'
import randomWords from 'random-words';

const Homepage = () => {

    const [names, setNames] = useState(['']);
    const [identities, setIdentities] = useState([]);
    const [seeds, setSeeds] = useState([]);
    const [roomlink, setRoomlink] = useState("")

    const addName = () => {
        setNames([...names, ''])
    }

    const handleChange = (e, idx) => {
        let temp = [...names];
        temp[idx] = e.target.value;
        setNames(temp)
    }

    const handleDelete = (e, idx) => {
        let temp = [...names];
        temp.splice(idx, 1);
        setNames(temp)
    }

    const generateKeyPair = async () => {
        let seedString = randomWords({ exactly: 3, join: "-" });
        setSeeds(prev => [...prev, seedString]);
        const hash = new Uint8Array(await crypto.subtle.digest('SHA-512', new TextEncoder().encode(seedString))
        ).slice(0, 32);
        return keyPairFromSeed(hash);
    }


    const handleSubmit = async (e) => {
        //Create Identities
        e.preventDefault()
        setSeeds(prev => []);
        let temp = []
        for (let i = 0; i < names.length; i++) {
            let keypair = await generateKeyPair()
            let publicKey = toUrl(toBase64(keypair.publicKey))
            temp.push({
                publicKey,
                secretKey: toUrl(toBase64(keypair.secretKey)),
                info: {
                    name: names[i],
                    id: publicKey
                }
            })
        }

        setIdentities(temp);

        const roomID = Math.random().toString(36).slice(-8);
        let jim = postreq(roomID);
        jim.then((result) => console.log(result))

        setRoomlink(`${window.location.protocol}//${window.location.hostname}${window.location.port ? (":" + window.location.port) : ""}/rooms/${roomID}`)
    }

    const createConfig = () => {
        let confIdentities = identities.map(x => x.publicKey);
        console.log(confIdentities)

        return {
            name: 'Jam',
            description: '',
            speakers: confIdentities,
            moderators: [confIdentities[0]],
            access: {
                lockedIdentities: true,
                identities: confIdentities
            }
        }
    }



    const postreq = async (x) => {
        const response = await fetch(`https://jam.systems/_/api/v1/rooms/${x}`, {
            method: 'POST',
            mode: 'no-cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(createConfig())
        });
        return response;
    }



    return (
        <div className='flex justify-center md:py-8'>
            <div className='bg-white w-full md:max-w-3xl min-h-[100vh] md:min-h-full md:rounded-2xl py-4 border-solid border-gray-300 border-2'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex'>
                        <h1 className='text-xl  text-black font-semibold py-4'>
                            Create a private Jam shroom
                        </h1>
                        <img src={jamjpg} className="md:inline ml-auto w-14 h-auto"
                            alt='Jam mascot by @eejitlikeme' title='Jam mascot by @eejitlikeme' />
                    </div>

                    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col justify-center'>
                        {names.map((x, idx) => {
                            if (idx === 0) {
                                return (
                                    <div className='flex py-2 border-solid border-2 rounded px-2 my-2' key={idx}>
                                        <input className='mx-2 px-1 border-solid border-2 rounded placeholder-gray-400 bg-gray-50 w-48' type='text' value={x}
                                            onChange={(e) => handleChange(e, idx)} required />
                                        <div className='hover:cursor-pointer bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded '
                                            onClick={() => addName()}>
                                            add guest</div>
                                    </div>
                                )
                            }

                            return (
                                <div className='flex py-2 border-2 px-2' key={idx}>
                                    <input className='mx-2 px-1 border-solid border-2 rounded placeholder-gray-400 bg-gray-50 w-48' type='text' value={x}
                                        onChange={(e) => handleChange(e, idx)} required />
                                    <div className='hover:cursor-pointer bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded '
                                        onClick={(e) => { handleDelete(e, idx) }}>-</div>
                                </div>
                            )
                        })}

                        <input type='submit' value='🌱 Create Room' className='select-none h-12 px-6 my-4 text-lg text-black bg-gray-200 rounded-lg focus:shadow-outline active:bg-gray-300' ></input>
                    </form>
                </div>
                <div>
                    <a href={roomlink ? roomlink : "/"} target="_blank">{roomlink}</a>
                </div>
                {identities && identities.map((x, idx) => {
                    return (
                        <div key={idx}>
                            {x.info.name} <br />{seeds[idx]}
                        </div>
                    )
                })}


            </div>
        </div>
    )
}

export default Homepage
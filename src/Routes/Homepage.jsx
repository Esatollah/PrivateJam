import React, { useState, useEffect } from 'react'
import { keyPairFromSeed } from 'watsign';
import { toUrl } from 'fast-base64/url'
import { toBase64 } from 'fast-base64/js';
import jamjpg from '../img/jam.jpg'
import randomWords from 'random-words';
import { ShareIcon, ClipboardCopyIcon, ClipboardCheckIcon } from '@heroicons/react/outline'
const Homepage = () => {

    const [names, setNames] = useState(['']);
    const [identities, setIdentities] = useState([]);
    const [seeds, setSeeds] = useState([]);
    const [roomlink, setRoomlink] = useState("")
    const [didMount, setDidMount] = useState(false)
    const [copied, setCopied] = useState([]);
    const [shareable, setShareable] = useState(false)

    useEffect(() => {
        if (navigator.canShare) {
            setShareable(true);
        }
    }, [])

    useEffect(() => {

        if (didMount) {
            const roomID = Math.random().toString(36).slice(-8);
            let confIdentities = identities.map(x => x.publicKey);
            console.log(identities)
            console.log(confIdentities)


            let namesConf = {}
            confIdentities.forEach((pbkey, idx) => {
                namesConf[pbkey] = names[idx]
            });
            console.log(namesConf)

            let conf = {
                name: 'Jam',
                description: '',
                speakers: confIdentities,
                moderators: [confIdentities[0]],
                access: {
                    lockedIdentities: true,
                    identities: confIdentities
                },
                userDisplay: {
                    names: namesConf
                }
            }

            const post = async () => {
                return postreq(roomID, conf);
            }
            post()

            setRoomlink(`${window.location.protocol}//${window.location.hostname}${window.location.port ? (":" + window.location.port) : ""}/rooms/${roomID}`)
        } else {
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [identities])

    const addName = () => {
        setNames([...names, ''])
    }

    const handleChange = (e, idx) => {

        setNames(prev => {
            let temp = [...prev]
            temp[idx] = e.target.value;
            return temp;
        })

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
        e.preventDefault()
        setDidMount(true)
        setSeeds([]);
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
        setCopied(Array(names.length).fill(false))
        setIdentities(temp);

    }

    const copytoClipboard = (x, idx) => {
        navigator.clipboard.writeText(x)

        setCopied(prev => {
            let temp = [...prev]
            temp[idx] = true;
            return temp;
        })

        setTimeout(() => {
            setCopied(prev => {
                let temp = [...prev]
                temp[idx] = false;
                return temp;
            })
        }, 1500)
    }

    const handleShare = (x) => {
        try {
            navigator.share({
                text: `Here's your code to the private Jam session: ${x}`,
                url: roomlink
            })
        } catch (error) {
            console.error(error)
        }
    }

    const postreq = async (x, conf) => {
        const response = await fetch(`https://beta.jam.systems/_/pantry/api/v1/rooms/${x}`, {
            method: 'POST',
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(conf)
        });
        return response;
    }



    return (
        <div className='flex justify-center md:py-8'>
            <div className='bg-white w-full md:max-w-3xl min-h-[100vh] md:min-h-full md:rounded-2xl py-4 border-solid
             border-gray-300 border-2 flex flex-col items-center'>
                <div className='flex flex-col justify-center items-center pb-4'>
                    <div className='flex'>

                        <h1 className='text-xl  text-black font-semibold py-4'>
                            Create a private Jam room
                        </h1>
                        <img src={jamjpg} className="md:inline ml-auto w-14 h-auto"
                            alt='Jam mascot by @eejitlikeme' title='Jam mascot by @eejitlikeme' />
                    </div>

                    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col justify-center items-center'>
                        <input type='submit' value='🌱 Create Room' className='select-none h-12 px-6 my-4 text-lg text-black bg-gray-200 
                        rounded-lg focus:shadow-outline active:bg-gray-300 w-full hover:cursor-pointer' />
                        {names.map((x, idx) => {
                            if (idx === 0) {
                                return (
                                    <div className='flex py-2 border-2 px-2 my-2 w-full' key={idx}>
                                        <input className='mx-2 px-1 border-solid border-2 rounded placeholder-gray-400 bg-gray-50 w-48 h-8' type='text' value={x}
                                            onChange={(e) => handleChange(e, idx)} required placeholder="Moderator" maxLength={12} />
                                    </div>
                                )
                            }

                            return (
                                <div className='flex py-2 border-2 px-2' key={idx}>
                                    <input className='mx-2 px-1 border-solid border-2 rounded placeholder-gray-400 bg-gray-50 w-48 ' type='text' value={x}
                                        onChange={(e) => handleChange(e, idx)} required maxLength={12} />
                                    <div className='hover:cursor-pointer bg-transparent hover:bg-red-500 text-red-700 font-semibold
                                     hover:text-white py-2 px-4 border border-red-500 active:bg-red-700 hover:border-transparent rounded '
                                        onClick={(e) => { handleDelete(e, idx) }}>-</div>
                                </div>
                            )
                        })}
                        <div className='my-1' />
                        <div className='hover:cursor-pointer bg-transparent hover:bg-green-500 text-green-700 font-semibold active:bg-green-700 hover:text-white 
                                        py-2 px-2 border border-green-500 hover:border-transparent rounded w-3/5 text-center'
                            onClick={() => addName()} unselectable="on" >
                            add guest</div>
                    </form>
                </div>

                <div className={didMount ?
                    'flex flex-col items-center align-middle bg-[#faf5ef] py-2 w-4/5 rounded-2xl border-4 border-[#c0bab3]'
                    : 'hidden'}>
                    <h1 className='text-2xl font-bold mt-0 mb-2 font-mono text-[#58544e] '>Guest List</h1>
                    <div className='flex flex-col justify-center bg-[#faf5ef] brightness-95 text-center pt-2 pb-4 px-4 rounded'>
                        <h3 className='text-xl text-[#faf5ef] brightness-[0.45]'>Room Link:</h3>
                        <div className='my-1'/>
                        <a href={roomlink ? roomlink : "/"} target="_blank" rel="noreferrer" className='border-b-2'>{roomlink}</a>
                    </div>

                    <div className='my-2'/>

                    <div className='w-full flex-col justify-center justify-items-center items-center' >
                        {identities && identities.map((x, idx) => {
                            return (
                                <div className='flex justify-self-center items-center ml-[25%]' key={idx}>
                                    <div className='text-center border-2 border-spacing-1 border-[#d5cfc8] my-1 self-center p-2' >
                                        <span className='font-bold text-[#58544e]'>{x.info.name}</span> <br />
                                        <span className='text-[#58544f]'>{seeds[idx]}</span>
                                    </div>

                                    <div className='flex ml-auto mr-[25%] space-x-2'>
                                        {shareable ?
                                            <ShareIcon className='h-6 hover:cursor-pointer hover:border-2 border-black active:bg-gray-400 rounded text-[#58544e]'
                                                onClick={() => { handleShare(seeds[idx]) }} />
                                            :
                                            null
                                        }

                                        {copied[idx] ?
                                            <ClipboardCheckIcon className='h-6 hover:cursor-pointer hover:border-2 border-black active:bg-gray-400 rounded text-[#58544e]'
                                                onClick={() => navigator.clipboard.writeText(seeds[idx])} />
                                            :
                                            <ClipboardCopyIcon className='h-6 hover:cursor-pointer hover:border-2 border-black active:bg-gray-400 rounded text-[#58544e]'
                                                onClick={() => copytoClipboard(seeds[idx], idx)} />
                                        }
                                    </div>


                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Homepage
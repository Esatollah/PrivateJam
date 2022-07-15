import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import jamjpg from '../img/jam.jpg'
const Room = () => {
    const { rid } = useParams();
    const [submitted, setSubmitted] = useState(false);
    const [password, setPassword] = useState('');
    const [jamHash, setJamHash] = useState('');



    const handleSubmit = () => {
        const jamConfig = {
            ux: {
                autoRejoin: true,
                autoJoin: true
            },
            keys: {
                seed: password,
            },
        };

        setJamHash(window.btoa(JSON.stringify(jamConfig)));

        setSubmitted(true)
    }




    return (
        <div className='flex justify-center md:py-2'>
            <div className='bg-white w-full md:max-w-3xl min-h-[100vh] md:min-h-full md:rounded-2xl  border-solid border-gray-300 border-2 '>
                <div className={submitted ? 'hidden' : 'flex flex-col justify-center items-center my-4'}>
                    <div className='flex'>
                        <h1 className='text-xl  text-black font-semibold py-4'>
                            Enter Password for Room "{rid}"
                        </h1>
                        <img src={jamjpg} className="md:inline ml-auto w-14 h-auto"
                            alt='Jam mascot by @eejitlikeme' title='Jam mascot by @eejitlikeme' />
                    </div>

                    <input className='mx-2 px-1 border-solid border-2 rounded placeholder-gray-400 bg-gray-50 w-48 py-2 mb-2' type='text' value={password}
                        onChange={(e) => setPassword(e.target.value)} required />
                    <input type='submit' value='🌱 Join Room' className='select-none h-12 px-6 text-lg text-black
                bg-gray-200 rounded-lg focus:shadow-outline active:bg-gray-300 hover:cursor-pointer' onClick={() => handleSubmit()} />
                    <div className="my-4"></div>



                </div>
                <div className={submitted ? "flex flex-col justify-center items-center my-4 w-full" : "hidden"}>
                    {
                        submitted ? <iframe height={window.screen.width < 768 ? '800' : '500'} width="80%"
                            allow="microphone;*" title="Jam" src={`https://beta.jam.systems/${rid}?debug=true#${jamHash}`} /> : null
                    }
                    <div className='text-center w-14 mt-4 mb-1 hover:cursor-pointer bg-transparent hover:bg-red-500 text-red-700 text-sm font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded '

                        onClick={() => { setSubmitted(false) }}>↻</div>
                </div>
            </div>
        </div>
    )
}

export default Room
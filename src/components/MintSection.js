import React from 'react'
import { PlusIcon } from '@heroicons/react/solid'
import { callWithAmount } from '../utils';

const MintSection = ({
    name,
    totalSupply,
    minted,
    id,
    mintedReady,
    price
}) => {

    const mintAnNFT = async () => {
        const res = await callWithAmount('mintNFT', { id }, price);
    }

    return (
        <div className="text-center border-gray-800	border rounded mx-14 p-8 my-20">
            <h1 className="text-3xl my-4 font-bold text-gray-900">
                {minted}/{totalSupply}
            </h1>
            <h3 className="mt-2 text-lg font-medium text-gray-900">{ mintedReady ? name + ' is still being minted' : 'Mint would be live soon' }</h3>
            <p className="mt-1 text-sm text-gray-500">
                { mintedReady ? `We are still minting ${name}, and would be happy to have you as an owner.` :  'Still adding NFTs, and would be happy to have you as an owner. We will let you know when they are live.' }
            </p>
            <div className="mt-6">
                {mintedReady && <button
                    onClick={() => mintAnNFT()}
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Mint Now
                </button>}
            </div>
        </div>
    )
}

export default MintSection;
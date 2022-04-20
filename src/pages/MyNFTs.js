import React from 'react'
import Header from '../components/Header';
import NFTCards from '../components/NFTCards';
import { getNFTData } from '../utils';

function MyNFTs()
{
    const [nfts, setNfts] = React.useState([]);

    // // add NFT to array of NFTs
    const fillNFTToState = async (entries) =>
    {
        let tmp = []
        for (let i = 0; i < entries.length; i++)
        {
            await getNFTData(parseInt(entries[i].split('_')[0]), parseInt(entries[i].split('_')[1])).then(nftData =>
            {
                tmp.push(nftData);
            })
        }
        setNfts([...tmp]);
    }

    React.useEffect(() =>
    {
        if (window.contract)
        {
            // window.contract is set by initContract in index.js
            // window.contract is set by initContract in index.js
            window.contract.getOwnerNFT({
                accountId: window.accountId
            }).then(entries =>
            {
                fillNFTToState(entries);
            });
        }
    }, [])

    return (
        <div>
            <Header />
            <div className="w-full rounded-lg text-center align-center">
                <div style={{
                    backgroundImage: 'url(https://pbs.twimg.com/media/FCFiJZPUcAIKIxG?format=jpg&name=large)'
                }} className='h-80 card-background'></div>
                <div className="flex justify-center">
                    <img src='https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' className="rounded-full object-center border-4 border-white -mt-12 shadow-lg align-center w-40 h-40" />
                </div>
                <h2 className="font-bold text-4xl pt-3 pb-2">{window.accountId}</h2>
                <p className="font-semibold p-2 text-sm text-gray-500">These are NFTs you own</p>
            </div>
            {/* NFT Listing */}
            <NFTCards nfts={nfts} />
        </div>
    )
}

export default MyNFTs
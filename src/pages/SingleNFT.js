import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import NFTCards from '../components/NFTCards';
import { logout } from '../utils';

function SingleNFT() {
    const { collectionId } = useParams();
    const [collection, setCollection] = React.useState([]);
    const [nfts, setNfts] = React.useState([]);
    const [allMinted, setAllMinted] = React.useState(false);

    const fillNFTToState = async (entries) => {
        let tmp = []
        for(let i = 1; i <= entries.totalSupply; i++) {
            await window.contract.getNFTData({
                id: +collectionId,
                nftId: i
            }).then(async nftData =>
            {
                let res = await fetch(nftData.metadata).then(res => res.json()).then(data => {
                    return data;
                })
                // adding data from ipfs
                nftData.name = res.name;
                nftData.attributes = res.attributes;
                nftData.image = res.image;

                tmp.push(nftData);
            })
        }
        setNfts([...tmp]);
    }

    React.useEffect(() => {
        if (window.walletConnection.isSignedIn())
        {
            // window.contract is set by initContract in index.js
            window.contract.getDetails({
                id: +collectionId
            }).then(entries => {
                setCollection(entries);
                // check if minting is finished
                window.contract.getMintedWithId({
                    id: +collectionId
                }).then(mint =>
                {
                    setAllMinted(+collection.totalSupply === +mint);
                });
                fillNFTToState(entries)
            });
        }
    }, [])

    return (
        <div>
            <Header />
            <div className="w-full rounded-lg text-center align-center">
                <div style={{
                    backgroundImage: `url(${collection.banner + '=h600'})` }} className='h-80 card-background'></div>
                <div className="flex justify-center">
                    <img src={collection.profilePic} className="rounded-full object-center border-4 border-white -mt-10 shadow-lg align-center" />
                </div>
                <h2 className="font-bold text-4xl pt-3 pb-2">{collection.name}</h2>
                <p className="font-semibold p-2 text-sm text-gray-500">Created by <span href="#" className="text-blue-500 hover:text-blue-700"> {collection.maker} </span> </p>
                <p className="mx-auto lg:px-10 md:px-6 sm:px-2 py-2 mb-5 text-gray-500 lg:w-6/12 md:w-6/12 w-10/12">
                    {collection.description}
                </p>
            </div>
            {/* NFT Listing */}
            <NFTCards nfts={nfts} />
        </div>
    )
}

export default SingleNFT
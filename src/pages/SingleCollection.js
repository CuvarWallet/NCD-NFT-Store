import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header';
import MintSection from '../components/MintSection';
import NFTCards from '../components/NFTCards';
import Notification from '../components/Notification';
import { checkTxFromURL, getNFTData } from '../utils';

function SingleCollection()
{
    const { collectionId } = useParams();
    const [collection, setCollection] = React.useState([]);
    const [nfts, setNfts] = React.useState([]);
    const [minted, setMinted] = React.useState(null);
    // minted ready? would have to wait till owner adds all NFTs to collection
    const [mintedReady, setMintedReady] = React.useState(false);
    // show notify
    const [showNotify, setShowNotify] = React.useState({ show: false, message: '' });

    // add NFT to array of NFTs
    const fillNFTToState = async (entries) =>
    {
        let tmp = []
        for (let i = 1; i <= entries.totalSupply; i++)
        {
            await getNFTData(collectionId, i).then(nftData =>
            {
                tmp.push(nftData);
                setMintedReady(true)
            }).catch(err =>
            {
                setMintedReady(false)
            })
        }
        setNfts([...tmp]);
    }

    // get minted NFTs
    const checkMinted = async () =>
    {
        // check if minting is finished
        let mintTimeout = setInterval(async () =>
        {
            window.contract.getMintedWithId({
                id: +collectionId
            }).then(mint =>
            {
                if (mint === collection.totalSupply)
                {
                    clearInterval(mintTimeout);
                    setNfts([]);
                    fillNFTToState(entries);
                }
                setMinted(mint);
            });
        }, 3000);
    }

    React.useEffect(() =>
    {
        if (window.contract)
        {
            {
                // window.contract is set by initContract in index.js
                window.contract.getDetails({
                    id: +collectionId
                }).then(entries =>
                {
                    setCollection(entries);
                    fillNFTToState(entries);
                    checkMinted();
                });

                // check if its a redirect from previous tx
                checkTxFromURL().then(tx =>
                {
                    if (tx === 'success')
                    {
                        setShowNotify({ show: true, message: 'NFT purchased successfully!' });
                        return;
                    } else if (tx === 'failed')
                    {
                        setShowNotify({ show: true, message: 'NFT purchase failed!' });
                    }
                });
            }
        }, [])

    return (
        <div>
            <Header />
            <div className="w-full rounded-lg text-center align-center">
                <div style={{
                    backgroundImage: `url(${collection.banner + '=h600'})`
                }} className='h-80 card-background'></div>
                <div className="flex justify-center">
                    <img src={collection.profilePic} className="rounded-full object-center border-4 border-white -mt-10 shadow-lg align-center w-40 h-40" />
                </div>
                <h2 className="font-bold text-4xl pt-3 pb-2">{collection.name}</h2>
                <p className="font-semibold p-2 text-sm text-gray-500">Created by <span href="#" className="text-blue-500 hover:text-blue-700"> {collection.maker} </span> </p>
                <p className="mx-auto lg:px-10 md:px-6 sm:px-2 py-2 mb-5 text-gray-500 lg:w-6/12 md:w-6/12 w-10/12">
                    {collection.description}
                </p>
            </div>
            {/* NFT Listing */}
            {
                minted
                    ?
                    +collection.totalSupply === +minted ? <NFTCards nfts={nfts} /> : <MintSection name={collection.name} totalSupply={collection.totalSupply} minted={minted} id={collection.id} mintedReady={mintedReady} price={collection.mintPrice} />
                    :
                    <div className="h-3/6 flex justify-center items-center m-20">
                        {/* loading icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', display: 'block', shapeRendering: 'auto' }} width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <rect x="17.5" y={30} width={15} height={40} fill="#1c4595">
                                <animate attributeName="y" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.5;1" values="18;30;30" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.2s" />
                                <animate attributeName="height" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.5;1" values="64;40;40" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.2s" />
                            </rect>
                            <rect x="42.5" y={30} width={15} height={40} fill="#e76a24">
                                <animate attributeName="y" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.5;1" values="20.999999999999996;30;30" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.1s" />
                                <animate attributeName="height" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.5;1" values="58.00000000000001;40;40" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.1s" />
                            </rect>
                            <rect x="67.5" y={30} width={15} height={40} fill="#01080a">
                                <animate attributeName="y" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.5;1" values="20.999999999999996;30;30" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" />
                                <animate attributeName="height" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.5;1" values="58.00000000000001;40;40" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" />
                            </rect>
                        </svg>
                    </div>
            }
            <Notification show={showNotify.show} hide={() => setShowNotify({ show: false, message: '' })} message={showNotify.message} />

        </div>
    )
}

export default SingleCollection
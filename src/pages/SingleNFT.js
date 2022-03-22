import React, { useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'
import { callWithAmount, checkTxFromURL, getNFTData } from '../utils'
import Notification from '../components/Notification'

function SingleNFT()
{
    const { collectionId, nftId } = useParams();
    const [nfts, setNfts] = useState({});
    const [sellPrice, setPrice] = useState(0);
    const [showNotify, setShowNotify] = React.useState({ show: false, message: '' });

    const triggerSales = async (nfts) => {
        if (nfts.owner === window.accountId)
        {
            callWithAmount('listNFT', {
                id: +collectionId,
                nftId: +nftId,
                price: +sellPrice
            }, 0).then(() => {
                setShowNotify({ show: true, message: 'NFT listed successfully' });
                setPrice(0);
            }).catch(err => {
                setShowNotify({ show: true, message: 'NFT listing failed' });
                setPrice(0);
            });
        } else if(nfts.owner !== window.accountId) {
            callWithAmount('buyNFT', {
                id: +collectionId,
                nftId: +nftId,
            }, nfts.price).then(() =>
            {
                setPrice(0);
            }).catch(err =>
            {
                setShowNotify({ show: true, message: 'NFT purchase failed!' });
                setPrice(0);
            });
        } else {
            return;
        }
    }


    React.useEffect(() => {
        if (window.walletConnection.isSignedIn())
        {
            getNFTData(collectionId, nftId).then(nftData => {
                setNfts(nftData);
            })

            checkTxFromURL().then(tx => {
                if (tx === 'success') {
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
        <div className="max-w-2xl mx-auto py-8 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* Product image */}
            <div className="mt-10 lg:mt-0 lg:self-center">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                    <img src={nfts.image} alt={nfts.name} className="w-10/12 h-10/12 object-center object-cover" />
                </div>
            </div>


            {/* Product form */}
            <div className="lg:max-w-lg">

                <div className="my-4">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{nfts.name}</h1>
                </div>
                <span className="text-gray-500 hover:text-gray-700">Owner: {nfts.owner}</span>

                <section aria-labelledby="information-heading" className="mt-4">
                    <h2 id="information-heading" className="sr-only">
                        Product information
                    </h2>

                    <div className="flex items-center">
                        <p className="text-lg text-gray-900 sm:text-xl">{nfts.listed}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                        {
                            nfts?.attributes?.map(attribute => (
                                <div className="m-2" key={attribute.value}>
                                    <p className="text-sm leading-5 font-medium text-gray-900">{attribute.trait_type}</p>
                                    <p className="text-sm leading-5 text-gray-500">{attribute.value}</p>
                                </div>
                            ))
                        }
                        <p className="text-base text-gray-500">{nfts.description}</p>
                    </div>
                </section>

                <section aria-labelledby="options-heading">
                        <div className='mt-6'>
                            <div className="mt-1">
                                <input
                                    disabled={nfts.owner !== window.accountId}
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={nfts.owner !== window.accountId ? nfts.price + ' NEAR' : sellPrice}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="p-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder={nfts.owner !== window.accountId ? nfts.price : "Input your price here"}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                disabled={nfts.price == 0 && nfts.owner !== window.accountId}
                                onClick={() => triggerSales(nfts)}
                                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                            >
                                    {nfts.price === 0 && nfts.owner !== window.accountId ? 'Not Listed' : nfts.owner !== window.accountId ? `Buy ${nfts.name}` : nfts.price !== 0 ? 'Change Price' : `Sell ${nfts.name}`}
                            </button>
                        </div>
                </section>
            </div>
            <Notification show={showNotify.show} hide={() => setShowNotify({ show: false, message: '' })} message={showNotify.message} />

        </div>
        </div>
    )
}

export default SingleNFT
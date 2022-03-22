import React from 'react';
import Header from '../components/Header';
import Notification from '../components/Notification';
import { callWithAmount, checkTxFromURL } from '../utils';
function CreatePage()
{
  const [showNotify, setShowNotify] = React.useState({ show: false, message: '' });
  const [input, setInput] = React.useState({
    name: '',
    description: '',
    profilePic: '',
    mintPrice: 0,
    totalSupply: 0,
    banner: ''
  });

  // new collection id
  const [collectionId, setCollectionId] = React.useState(0);
  const [metadataLink, setMetadataLink] = React.useState('');
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [pushJson, setPushJson] = React.useState('no-json');

  // create collection 
  const createCollection = async () => {
    const { name, description, profilePic, mintPrice, totalSupply, banner } = input;
    if(name === '' || description === '' || profilePic === '' || mintPrice === 0 || totalSupply === 0 || banner === '') {
      alert('Please fill all fields');
      return;
    }
    // 0.5 NEAR as fee
    const res = await callWithAmount(
      'createsNFT', 
      { 
        name,
        description,
        totalSupply : +totalSupply,
        mintPrice : +mintPrice,
        profilePic,
        banner
      },
      1);
  }

  // add NFT to collection
  const addNFT = async () => {
    let { totalSupply } = await window.contract.getDetails({
      id: +collectionId
    });
    
    // loop and add NFTs
    for(let i = 1; i <= totalSupply; i++) {
      await window.contract.add({
        "id": collectionId, 
        "nftId": i, 
        "metadata": metadataLink.includes('https://') ? metadataLink : pushJson === 'no-json' ? `https://gateway.ipfs.io/ipfs/${metadataLink}/${i}` : `https://gateway.ipfs.io/ipfs/${metadataLink}/${i}.json`
      }).then(async res => {
        await setUploadProgress(i / totalSupply * 100);
        if(i === totalSupply) {
          setShowNotify({ show: true, message: 'Collection created successfully' });
          // redirect to home page
          setTimeout(() => {
            window.location.href = `/${collectionId}`;
          }, 1000);
        }
      }).catch(err => {
        setShowNotify({ show: true, message: 'Creating collection failed, ' + err });
      })
    }
  }


  React.useEffect(() => {
    checkTxFromURL().then(tx =>
    {
      if (tx === 'success')
      {
        // get last collection
        window.contract.getLastAdded({
          accountId: window.accountId,
        }).then(tx =>
        {
          setShowNotify({ show: true, message: 'Collection created successfully!' });
          setCollectionId(tx);
        })
        return;
      } else if(tx === 'failed') {
        setShowNotify({ show: true, message: 'Collection creation failed!' });
      }
    });
  }, []);

  // section to show once collection is created
  const doneSection = () => {
    return (
      <div className="max-w-3xl lg:my-20 md:my-14 my-6 lg:mx-auto md:mx-auto mx-8 text-center">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
          <path fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
          </path>
        </svg>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Done!
        </h2>
        <p className="mt-4 text-gray-500">
          You've created your collection, add NFTs below
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl lg:my-20 md:my-14 my-6 lg:mx-auto md:mx-auto mx-8 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Create an NFT Collection
        </h2>
        <p className="mt-4 text-gray-500">
          Note: This is a beta feature, and is not yet available to the public. You also need to pay a fee to create a collection.
        </p>
      </div>
      {/* about */}
      <div className="items-center justify-center mx-5 mx-auto max-w-7xl px-4 mt-10">
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Collection Details</h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>
          </div>
          {/* add collection card */}
          <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                { collectionId === 0 ? <div>
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Name
                          </span>
                          <input
                            type="text"
                            id="name"
                            name='name'
                            value={input.name}
                            onChange={(e) => setInput({ ...input, name: e.target.value })}
                            className="p-3 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
                            placeholder="BAYC"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          name="about"
                          rows={3}
                          value={input.description}
                          onChange={(e) => setInput({ ...input, description: e.target.value })}
                          className="p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Tell us about your collection"
                          defaultValue={''}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Profile Image
                          </span>
                          <input
                            type="text"
                            name="profile-image"
                            id="profile-image"
                            value={input.profilePic}
                            onChange={(e) => setInput({ ...input, profilePic: e.target.value })}
                            className="p-3 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
                            placeholder="https://profile-image.url"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Banner Image
                          </span>
                          <input
                            type="text"
                            name="banner-image"
                            id="banner-image"
                            value={input.banner}
                            onChange={(e) => setInput({ ...input, banner: e.target.value })}
                            className="p-3 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
                            placeholder="https://banner-image.url"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Mint Price
                          </span>
                          <input
                            type="text"
                            name="mint-price"
                            id="mint-price"
                            value={input.mintPrice}
                            onChange={(e) => setInput({ ...input, mintPrice: e.target.value })}
                            className="p-3 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
                            placeholder="0 NEAR"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Supply
                          </span>
                          <input
                            type="text"
                            name="supply"
                            id="supply"
                            value={input.totalSupply}
                            onChange={(e) => setInput({ ...input, totalSupply: e.target.value })}
                            className="p-3 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={() => createCollection()}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create
                    </button>
                  </div>
                </div> : doneSection()
                }
              </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add Metadata Link</h3>
              <p className="mt-1 text-sm text-gray-600">
                  Upload metadata to ipfs as a folder and add the link here: example here <a className='text-indigo-600 font-medium' href="https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/0">QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/0</a>
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  {
                    uploadProgress === 0 ?
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="metadata-link" className="block text-sm font-medium text-gray-700">
                          NFT Metadata Link
                        </label>
                        <input
                          type="text"
                          name="metadata-link"
                          placeholder='QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW'
                          id="metadata-link"
                          value={metadataLink}
                          onChange={(e) => setMetadataLink(e.target.value)}
                          autoComplete="given-name"
                          className="mt-1 p-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                          <div className="mt-4 space-y-4">
                            <fieldset>
                            <div className="flex items-center">
                              <input
                                id="json"
                                name="json"
                                checked={pushJson === 'json'}
                                onChange={(e) => setPushJson(e.target.name)}
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                JSON Metadata
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="no-json"
                                name="no-json"
                                checked={pushJson === 'no-json'}
                                onChange={(e) => setPushJson(e.target.name)}
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                No-JSON Metadata
                              </label>
                            </div>
                            </fieldset>
                          </div>
                      </div>
                    </div> :
                    <div className="w-full bg-gray-200 rounded-full">
                      <div className="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full" style={{ width: uploadProgress + '%' }}>{uploadProgress + '%'}</div>
                    </div>
                }
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    disabled={uploadProgress > 0}
                    onClick={() => addNFT()}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {uploadProgress > 0 ? 'Uploading' : 'Upload'} NFTs
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      </div>
      <Notification show={showNotify.show} hide={() => setShowNotify({ show: false, message: '' })} message={showNotify.message} />
    </>
  )
}

export default CreatePage
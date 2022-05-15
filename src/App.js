import 'regenerator-runtime/runtime'
import React from 'react';
import LoggedOut from './pages/LoggedOut';
import LoggedIn from './pages/LoggedIn';
import { login } from './utils'
import { Route, Routes } from "react-router-dom";
import SingleCollection from './pages/SingleCollection';
import SingleNFT from './pages/SingleNFT';
import CreatePage from './pages/CreatePage';
import MyNFTs from './pages/MyNFTs';

export default function App()
{
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const checkLoggedIn = async () =>
  {
    setTimeout(async () =>
    {
      const res = await login();
      if (res && res.keys)
      {
        setLoggedIn(true);
      }
      setLoading(false);
    }, 1000);
  }

  React.useLayoutEffect(() =>
  {
    checkLoggedIn();
  }, [])

  if (loading)
  {
    return <div style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      display: 'flex'
    }}>
      <div>
        <div className="loading-spinner">
        </div>
        <h1 style={{
          marginTop: '10px',
          fontWeight: 'bold',
        }}>Loading...</h1>
      </div>
    </div>
  }
  if (!loggedIn && !loading)
  {
    return <LoggedOut />
  }
  return (
    <Routes>
      <Route exact path="/" element={<LoggedIn />} />
      <Route path="/:collectionId" element={<SingleCollection />} />
      <Route path="/:collectionId/:nftId" element={<SingleNFT />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/my-nft" element={<MyNFTs />} />
    </Routes>
  )
}


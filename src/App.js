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
import { useEffect } from 'react/cjs/react.production.min';

export default function App()
{
  const [loggedIn, setLoggedIn] = React.useState(false);

  const checkLoggedIn = async () =>
  {
    const res = await login();
    if (res && res.keys)
    {
      setLoggedIn(true);
    }
  }

  useEffect(() =>
  {
    checkLoggedIn();
  }, [])

  if (!loggedIn)
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


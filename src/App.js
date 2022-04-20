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

  // if not signed in, return early with sign-in prompt
  if (!window.accountId)
  {
    return <LoggedOut login={login} />
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


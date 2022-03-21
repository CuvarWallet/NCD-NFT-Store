import 'regenerator-runtime/runtime'
import React from 'react';
import LoggedOut from './pages/LoggedOut';
import LoggedIn from './pages/LoggedIn';
import { login, logout } from './utils'
import { Route, Routes } from "react-router-dom";
import SingleNFT from './pages/SingleNFT';

export default function App() {

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return <LoggedOut login={login} />
  }
  return (
    <Routes>
      <Route exact path="/" element={<LoggedIn/>} />
      <Route path="/:collectionId" element={<SingleNFT/>} />
    </Routes>
  )
}


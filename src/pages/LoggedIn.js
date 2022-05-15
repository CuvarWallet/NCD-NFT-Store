import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import Notification from '../components/Notification'
import TrendingCard from '../components/TrendingCard'

import { login, logout } from '../utils'

import getConfig from '../config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

function LoggedIn()
{

    const [collections, setCollections] = React.useState([])

    const [showNotification, setShowNotification] = React.useState(false)

    React.useEffect(
        () =>
        {
            // window.contract is set by initContract in index.js
            window.contract.entries().then(entries =>
            {
                setCollections(entries);
            })
        },
        []
    )

    return (
        <>
            {/* <Header accountId={accountId} logout={logout} greeting={greeting} /> */}
            <HeroSection accountId={window.accountId} isLogin={true} />
            {/* heading */}
            <div className="max-w-3xl lg:my-20 md:my-14 my-6 lg:mx-auto md:mx-auto mx-8 text-center">
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    Latest Collections
                </h2>
                <p className="mt-4 text-gray-500">
                    At the beginning at least, but then we realized we could make a lot more money if we kinda stopped caring
                    about that. Our new strategy is to write a bunch of things that look really good in the headlines, then
                    clarify in the small print but hope people don't actually read it.
                </p>
            </div>
            {/* card row */}
            <TrendingCard collections={collections} />
            {showNotification && <Notification networkId={networkId} />}
        </>
    )
}

export default LoggedIn
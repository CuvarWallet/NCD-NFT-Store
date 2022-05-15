import React from 'react'
import HeroSection from '../components/HeroSection'
import TrendingCard from '../components/TrendingCard'

function LoggedOut()
{

    return (
        <>
            <HeroSection />
            {/* card row */}
            <div className="max-w-3xl border-gray-800 border rounded px-8 py-4 lg:my-20 md:my-14 my-6 lg:mx-auto md:mx-auto mx-8 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Login to create/view NFTs
                </h2>
                <p className="mt-4 text-gray-500">
                    At the beginning at least, but then we realized we could make a lot more money if we kinda stopped caring
                    about that. Our new strategy is to write a bunch of things that look really good in the headlines, then
                    clarify in the small print but hope people don't actually read it.
                </p>
            </div>
        </>
    )
}

export default LoggedOut
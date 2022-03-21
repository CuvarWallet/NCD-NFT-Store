import React from 'react'
import { Link } from 'react-router-dom'
import { truncateString } from '../utils'

function TrendingCard({ collections }) {
  return (
      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grids-cols-1 flex items-center justify-center mx-5 mx-auto max-w-7xl px-4">
          {
                collections.map((collection, key) => (
                    <Link key={key} to={`/${collection.key}`}>
                        <div className="sm:w-full bg-white border border-gray-100 rounded-lg text-center hover:shadow-lg align-center m-4">
                            <div style={{ backgroundImage: `url(${collection.value?.banner})` }} className='h-40 card-background'></div>
                                <div className="flex justify-center">
                                    <img src={collection.value?.profilePic} className="rounded-full object-center border-4 border-white -mt-6 shadow-lg align-center" />
                                </div>
                                <p className="font-bold pt-3 pb-2">{collection.value?.name}</p>
                                <p className="font-semibold p-2 text-sm text-gray-500"> by <span href="#" className="text-blue-500 hover:text-blue-700"> {collection.value?.maker} </span> </p>
                            <p className="px-10 py-2 mb-5 text-gray-500">{truncateString(collection.value?.description, 150)}</p>
                        </div>
                    </Link>
                ))
          }
      </div>
  )
}

export default TrendingCard
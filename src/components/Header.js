import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { logout } from '../utils'
import { Link } from 'react-router-dom'

const Header = () =>
{
    return (
        <div className="relative bg-gray-50 overflow-hidden">
            <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full" aria-hidden="true">
            </div>

            <div className="relative pt-6 pb-6 sm:pb-6">
                <Popover>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <nav className="relative flex items-center justify-between sm:h-10 md:justify-center" aria-label="Global">
                            <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                                <div className="flex items-center justify-between w-full md:w-auto">
                                    <Link to="/">
                                        <span className="sr-only">Workflow</span>
                                        <img
                                            className="h-8 w-auto sm:h-10"
                                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                            alt=""
                                        />
                                    </Link>
                                    <div className="-mr-2 flex items-center md:hidden">
                                        <Popover.Button className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                            <span className="sr-only">Open main menu</span>
                                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                                        </Popover.Button>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                                {window.accountId !== '' && <p className='px-8 font-medium'>Hello, {window.accountId}</p>}
                                <span className="inline-flex rounded-md shadow mx-4">
                                    <Link to='/my-nft'>
                                        <a
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                                        >
                                            My NFTs
                                        </a>
                                    </Link>
                                </span>
                                <span className="inline-flex rounded-md shadow">
                                    <a
                                        href="#"
                                        onClick={(e) => logout()}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                                    >
                                        Log Out
                                    </a>
                                </span>
                            </div>
                        </nav>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="duration-150 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="duration-100 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Popover.Panel
                            focus
                            className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                        >
                            <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                                <div className="px-5 pt-4 flex items-center justify-between">
                                    <div>
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="-mr-2">
                                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                            <span className="sr-only">Close menu</span>
                                            <XIcon className="h-6 w-6" aria-hidden="true" />
                                        </Popover.Button>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    onClick={(e) => logout()}
                                    className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                                >
                                    Log Out
                                </a>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            </div>
        </div>
    )
}


export default Header
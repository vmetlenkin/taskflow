import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

type Props = {
  children: React.ReactNode;
}

const Dropdown: React.FC<Props> = ({ children }) => {
  return (
    <div className="top-16 w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-2 py-2
            text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2
            focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <ChevronDownIcon
              className="h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md
            bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default Dropdown;
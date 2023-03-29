import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="sticky top-0 px-5 backdrop-blur-sm flex justify-between items-center h-14 z-10">
      <div className="text-xl font-bold"><span className="text-indigo-500">Task</span>Flow</div>
      <div className="flex space-x-4 items-center">
        <div>{sessionData?.user?.name}</div>
        {sessionData &&
          <Image
            width={50}
            height={50}
            className="w-8 h-8 rounded-full"
            src={sessionData?.user?.image}
            alt="Rounded avatar"
          />
        }
        <button
          className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-gray-100 font-medium
            rounded-md text-sm px-5 py-2 text-center inline-flex items-center dark:focus:ring-gray-500"
          onClick={() => void signOut({ callbackUrl: '/' })}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Header;
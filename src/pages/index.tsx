import { type NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import React from "react";
import GithubIcon from "~/modules/svg/GithubIcon";

const Home: NextPage = () => {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="bg-white p-4 rounded-md w-80">
        <h1 className="text-center text-2xl mb-4 font-medium">Login</h1>
        <button
          className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-gray-100 font-medium
            rounded-md text-sm px-5 py-2 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 w-full"
          onClick={() => void signIn('github', { callbackUrl: '/dashboard' })}
        >
          <GithubIcon />
          Sign in with GitHub
        </button>
      </div>
    </main>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      },
      props:{},
    };
  }

  return {
    props: {}
  }
}

export default Home;

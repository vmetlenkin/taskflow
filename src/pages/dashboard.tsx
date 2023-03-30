import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { NextPage } from "next";
import { api } from "~/utils/api";
import Spinner from "~/ui/Spinner";
import Link from "next/link";
import Button from "~/ui/Button";
import CreateProjectModal from "~/modules/CreateProjectModal";
import Header from "~/modules/Header/Header";

const Dashboard: NextPage = () => {
  const { data: boards, refetch: refetchBoards, isLoading } = api.board.getBoardsByUserID.useQuery();
  const { mutate: deleteBoard } = api.board.delete.useMutation({
    onSuccess: () => {
      void refetchBoards();
    }
  });

  const [createProjectModal, showCreateProjectModal] = useState(false);

  return (
    <>
      <Header />
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-medium">My projects</h1>
          <Button onClick={() => showCreateProjectModal(true)}>
            Add project
          </Button>
        </div>

        {isLoading ?
            <div className="flex h-96 items-center justify-center">
              <Spinner />
            </div>
          :
          <div className="grid grid-cols-5 gap-4">
            {boards.map(board => (
              <div key={board.id} className="p-4 bg-white rounded-md">
                <Link
                  href={`/board/${board.id}`}
                  className="block text-xl mb-2 hover:text-indigo-700 font-medium"
                >
                  {board.name}
                </Link>
                <button onClick={() => deleteBoard({ id: board.id })}>Delete</button>
              </div>
            ))}
          </div>
        }

        <CreateProjectModal open={createProjectModal} setOpen={showCreateProjectModal} refetch={refetchBoards} />
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props:{},
    };
  }

  return {
    props: {}
  }
}

export default Dashboard;
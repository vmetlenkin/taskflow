import React from "react";
import KanbanBoard from "~/components/KanbanBoard/KanbanBoard";
import Header from "~/components/Header/Header";
import { getSession } from "next-auth/react";

type Props = {
  id: string;
};

const BoardPage: React.FC<Props> = ({ id }) => {
  return (
    <>
      <Header />
      <KanbanBoard id={id} />
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
      props: {},
    };
  }

  const id = context.params.boardId;

  return {
    props: { id }
  }
}

export default BoardPage;
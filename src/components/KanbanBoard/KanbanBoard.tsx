import React, {  useState } from "react";
import { BoardResponse, IBoard, useKanbanStore } from "~/components/KanbanBoard/KanbanBoard.store";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { api } from "~/utils/api";
import Spinner from "~/ui/Spinner";
import Button from "~/ui/Button";
import CreateTaskModal from "~/components/KanbanBoard/components/CreateTaskModal";
import { useSession } from "next-auth/react";
import { getNewRank } from "~/components/KanbanBoard/KanbanBoard.helpers";
import CreateColumnModal from "~/components/KanbanBoard/components/CreateColumnModal";
import EditTaskModal from "~/components/KanbanBoard/components/EditTaskModal";
import DeleteColumnModal from "~/components/KanbanBoard/components/DeleteColumnModal";
import ColumnMenu from "~/components/KanbanBoard/components/ColumnMenu";
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  id: string;
};

const KanbanBoard: React.FC<Props> = ({ id }) => {
  const {
    setBoard,
    moveTask,
    setSelectedTaskId,
    setSelectedColumnId,
    setSelectedColumnTaskNumber,
    board
  } = useKanbanStore();
  const { data: sessionData } = useSession();

  const { isLoading } = api.board.getBoardByID.useQuery({ id }, {
    onSuccess: (board: BoardResponse) => {
      setBoard(board);
    }
  });

  const { mutate: dragTask } = api.board.dragTask.useMutation({
    onSuccess: (task) => {
      console.log(task);
    }
  });

  const [createTaskModal, showCreateTaskModal] = useState(false);
  const [editTaskModal, showEditTaskModal] = useState(false);
  const [createColumnModal, showCreateColumnModal] = useState(false);
  const [deleteColumnModal, showDeleteColumnModal] = useState(false);

  const handleDragEnd = (dropResult: DropResult) => {
    const { source, destination, draggableId } = dropResult;

    if (!destination) return;

    if (destination.index === source.index &&
      destination.droppableId === source.droppableId) {
      return;
    }

    const { tasks } = board!.columns[destination.droppableId]!;
    const isDifferentColumn = source.droppableId !== destination.droppableId;
    const rank = getNewRank(source.index, destination.index, tasks!, isDifferentColumn);

    dragTask({
      id: draggableId,
      endColumnId: destination.droppableId,
      endColumnPosition: rank
    });

    moveTask(source, destination);
  }

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-5 pt-5">
        <div className="text-2xl font-medium">
          <Link href="/dashboard" className="text-indigo-500 hover:underline">Boards</Link> / {board!.name}
        </div>
      </div>
      <div className="flex w-full mx-auto space-x-4 px-5">
          <DragDropContext onDragEnd={handleDragEnd}>
            {Object.entries(board!.columns).map(column => (
              <div
                key={column[0]}
                className="bg-gray-200 shrink-0 rounded-md w-1/5 2xl:w-1/6"
              >
                <div className="flex justify-between p-2 items-center">
                  <div className="w-full font-medium">{column[1].title}</div>
                  <ColumnMenu id={column[1].id} showDeleteColumnModal={showDeleteColumnModal} />
                </div>
                  <Droppable droppableId={column[0]}>
                    {(provided, snapshot) => (
                      <div
                        className={`${snapshot.isDraggingOver ? 'bg-gray-300' : ''} flex flex-col min-h-screen p-2"`}
                        key={column[0]}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <div className="p-2">
                          {column[1].tasks?.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  onClick={() => {
                                    showEditTaskModal(true);
                                    setSelectedTaskId(item.id);
                                  }}
                                  className="p-4 bg-white mb-2 rounded-md"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div>
                                    <div className="mb-2 font-medium">{item.title}</div>
                                    <div className="mb-2 text-sm text-gray-500">{item.description}</div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500 flex space-x-2 items-center">
                                      <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                                      <div>0</div>
                                    </div>
                                    <img
                                      className="w-8 h-8 rounded-full"
                                      src={sessionData!.user.image!}
                                      alt="Rounded avatar"
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        <div className="flex-1 h-full">
                          {provided.placeholder}
                        </div>
                        <div className="sticky bottom-0 p-2 backdrop-blur-md">
                          <Button
                            onClick={() => {
                              showCreateTaskModal(true);
                              setSelectedColumnTaskNumber(column[1].tasks!.length);
                              setSelectedColumnId(column[0]);
                            }}
                            fullWidth
                          >
                            Add task
                          </Button>
                        </div>
                      </div>
                    )}
                  </Droppable>
              </div>
            ))}
            <div className="p-2">
              <Button onClick={() => showCreateColumnModal(true)}>
                <PlusIcon className="w-5 h-5 text-white" />
              </Button>
            </div>
          </DragDropContext>
        </div>
      <CreateTaskModal open={createTaskModal} setOpen={showCreateTaskModal} />
      <EditTaskModal open={editTaskModal} setOpen={showEditTaskModal} />
      <CreateColumnModal open={createColumnModal} setOpen={showCreateColumnModal} />
      <DeleteColumnModal open={deleteColumnModal} setOpen={showDeleteColumnModal} />
    </>
  );
};

export default KanbanBoard;
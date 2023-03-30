import React, { useState } from "react";
import {
  BoardResponse,
  IColumn, ITask,
  useKanbanStore
} from "~/modules/KanbanBoard/KanbanBoard.store";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from "@hello-pangea/dnd";
import { api } from "~/utils/api";
import Spinner from "~/ui/Spinner";
import Button from "~/ui/Button";
import CreateTaskModal from "~/modules/KanbanBoard/components/CreateTaskModal";
import { useSession } from "next-auth/react";
import { getNewRank } from "~/modules/KanbanBoard/KanbanBoard.helpers";
import CreateColumnModal from "~/modules/KanbanBoard/components/CreateColumnModal";
import EditTaskModal from "~/modules/KanbanBoard/components/EditTaskModal";
import DeleteColumnModal from "~/modules/KanbanBoard/components/DeleteColumnModal";
import ColumnMenu from "~/modules/KanbanBoard/components/ColumnMenu";
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type KanbanBoardProps = {
  id: string;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ id }) => {
  const {
    setBoard,
    moveTask,
    board
  } = useKanbanStore();

  const { isFetching } = api.board.getBoardByID.useQuery({ id }, {
    refetchOnWindowFocus: false,
    onSuccess: (board: BoardResponse) => {
      setBoard(board);
    }
  });

  const { mutate: dragTaskRequest } = api.board.dragTask.useMutation();

  const [createTaskModal, showCreateTaskModal] = useState(false);
  const [editTaskModal, showEditTaskModal] = useState(false);
  const [createColumnModal, showCreateColumnModal] = useState(false);
  const [deleteColumnModal, showDeleteColumnModal] = useState(false);

  const handleDragEnd = (dropResult: DropResult) => {
    const { source, destination, draggableId } = dropResult;

    if (!destination) return;

    // If position is the same return nothing
    if (destination.index === source.index &&
      destination.droppableId === source.droppableId) {
      return;
    }

    const { tasks } = board.columns[destination.droppableId];
    const isDifferentColumn = source.droppableId !== destination.droppableId;
    const rank = getNewRank(source.index, destination.index, tasks, isDifferentColumn);

    dragTaskRequest({
      id: draggableId,
      endColumnId: destination.droppableId,
      endColumnPosition: rank
    });

    moveTask(source, destination);
  }

  if (isFetching) {
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
          <Link href="/dashboard" className="text-indigo-500 hover:underline">Boards</Link> / {board?.name}
        </div>
      </div>
      <div className="flex w-full mx-auto space-x-4 px-5">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(board?.columns).map(column => (
            <KanbanColumn
              key={column[0]}
              column={column}
              showDeleteColumnModal={showDeleteColumnModal}
              showEditTaskModal={showEditTaskModal}
              showCreateTaskModal={showCreateTaskModal}
            />
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

type KanbanColumnProps = {
  column: [string, IColumn];
  showDeleteColumnModal: (open: boolean) => void;
  showEditTaskModal: (open: boolean) => void;
  showCreateTaskModal: (open: boolean) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = (props) => {
  const {
    column,
    showDeleteColumnModal,
    showEditTaskModal,
    showCreateTaskModal
  } = props;

  const {
    setSelectedColumnId,
    setSelectedColumnTaskNumber,
  } = useKanbanStore();

  return (
    <div className="bg-gray-200 shrink-0 rounded-md w-1/5 2xl:w-1/6">
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
              {column[1].tasks?.map((task, index) => (
                <KanbanTask
                  key={task.id}
                  task={task}
                  index={index}
                  showEditTaskModal={showEditTaskModal}
                />
              ))}
            </div>
            <div className="flex-1 h-full">
              {provided.placeholder}
            </div>
            <div className="sticky bottom-0 p-2 backdrop-blur-md">
              <Button
                onClick={() => {
                  showCreateTaskModal(true);
                  setSelectedColumnTaskNumber(column[1].tasks.length);
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
  );
};

type KanbanTaskProps = {
  task: ITask;
  index: number;
  showEditTaskModal: (open: boolean) => void;
};

const KanbanTask: React.FC<KanbanTaskProps> = (props) => {
  const { task, index, showEditTaskModal } = props;

  const { data: sessionData } = useSession();

  const { setSelectedTaskId } = useKanbanStore();

  return (
    <Draggable
      draggableId={task.id}
      index={index}
    >
      {(provided) => (
        <div
          onClick={() => {
            showEditTaskModal(true);
            setSelectedTaskId(task.id);
          }}
          className="p-4 bg-white mb-2 rounded-md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div>
            <div className="mb-2 font-medium">{task.title}</div>
            <div className="mb-2 text-sm text-gray-500">{task.description}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 flex space-x-2 items-center">
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
              <div>0</div>
            </div>
            <img
              className="w-8 h-8 rounded-full"
              src={sessionData?.user.image!}
              alt="Rounded avatar"
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanBoard;
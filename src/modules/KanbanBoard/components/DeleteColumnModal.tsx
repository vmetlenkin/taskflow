import React from "react";
import Modal from "~/ui/Modal";
import Button from "~/ui/Button";
import { api } from "~/utils/api";
import { IColumn, useKanbanStore } from "~/modules/KanbanBoard/KanbanBoard.store";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DeleteColumnModal: React.FC<Props> = ({ open, setOpen }) => {
  const { selectedColumnId, removeColumn } = useKanbanStore();

  const { mutate: deleteColumn, isLoading: isColumnDeleting } = api.board.removeColumnByID.useMutation({
    onSuccess: (column: IColumn) => {
      removeColumn(column);
      setOpen(false);
    }
  });

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="mb-4 flex items-center justify-between border-zinc-200 pb-4">
        <span className="font-semibold">Are you sure you want to delete this column?</span>
        <div
          className="cursor-pointer rounded-md p-1.5 hover:bg-zinc-200"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          isLoading={isColumnDeleting}
          onClick={() => deleteColumn({ id: selectedColumnId })}
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete column
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteColumnModal;
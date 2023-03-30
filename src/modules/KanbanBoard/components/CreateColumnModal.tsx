import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from "~/ui/Modal";
import Button from "~/ui/Button";
import { api } from "~/utils/api";
import { IColumn, useKanbanStore } from "~/modules/KanbanBoard/KanbanBoard.store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const validationSchema = z.object({
  title: z.string().min(5, 'Title length must be at least 5 characters'),
});

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateColumnModal: React.FC<Props> = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState,
    reset : resetFormFields,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema)
  });

  const { addColumn, board } = useKanbanStore();

  const { mutate: createColumn, isLoading: isCreatingColumn } = api.board.createColumn.useMutation({
    onSuccess: (column: IColumn) => {
      addColumn(column);
      setOpen(false);
      resetFormFields();
    }
  });

  const handleCreateColumn: SubmitHandler<ValidationSchema> = (formData) => {
    createColumn({
      boardId: board!.id,
      order: 1,
      title: formData.title
    });
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="mb-4 flex items-center justify-between border-zinc-200 pb-4">
        <span className="font-semibold">New column</span>
        <div
          className="cursor-pointer rounded-md p-1.5 hover:bg-zinc-200"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-4 w-4" />
        </div>
      </div>
      <form onSubmit={handleSubmit(handleCreateColumn)}>
        <div className="mb-2">
          <input
            {...register('title')}
            type="text"
            placeholder="Column title"
            className="w-full bg-transparent text-xl outline-none placeholder:text-zinc-500 font-semibold"
          />
          <div className="w-80" />
          {formState.errors.title && (
            <span className="block text-red-500 mt-1 text-sm">{formState.errors.title.message}</span>
          )}
        </div>
        <div className="pt-8">
          <Button isLoading={isCreatingColumn}>Create column</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateColumnModal;
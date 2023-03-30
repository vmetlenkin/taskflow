import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from "~/ui/Modal";
import Button from "~/ui/Button";
import { api } from "~/utils/api";
import { ITask, useKanbanStore } from "~/modules/KanbanBoard/KanbanBoard.store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LexoRank } from "lexorank";

const validationSchema = z.object({
  title: z.string().min(5, 'Title length must be at least 5 characters'),
  description: z.string().min(5, 'Description length must be at least 5 characters')
});

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateTaskModal: React.FC<Props> = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState,
    reset : resetFormFields,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema)
  });

  const { selectedColumnId, board } = useKanbanStore();
  const { addTask } = useKanbanStore();

  const { mutate: createTask, isLoading: isCreatingTask } = api.board.createTask.useMutation({
    onSuccess: (task: ITask) => {
      addTask(task);
      setOpen(false);
      resetFormFields();
    }
  });

  const handleCreateTask: SubmitHandler<ValidationSchema> = (formData) => {
    const tasks = board?.columns[selectedColumnId]?.tasks;

    const order = !tasks?.length ?
      LexoRank.middle().toString() :
      LexoRank.parse(tasks[tasks.length - 1]?.order as string).genNext().toString();

    createTask({
      columnId: selectedColumnId,
      title: formData.title,
      order: order,
      description: formData.description
    });
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="mb-4 flex items-center justify-between border-zinc-200 pb-4">
        <span className="font-semibold">New task</span>
        <div
          className="cursor-pointer rounded-md p-1.5 hover:bg-zinc-200"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-4 w-4" />
        </div>
      </div>
      <form onSubmit={handleSubmit(handleCreateTask)}>
        <div className="mb-2">
          <input
            {...register('title')}
            type="text"
            placeholder="Task title"
            className="w-full bg-transparent text-xl outline-none placeholder:text-zinc-500 font-semibold"
          />
          <div className="w-80" />
          {formState.errors.title && (
            <span className="block text-red-500 mt-1 text-sm">{formState.errors.title.message}</span>
          )}
        </div>
        <div className="mb-4">
          <textarea
            {...register('description')}
            rows={2}
            placeholder="Add description..."
            className="w-full bg-transparent placeholder:text-zinc-500 outline-none"
          />
          {formState.errors.description && (
            <span className="block text-red-500 mt-1 text-sm">{formState.errors.description.message}</span>
          )}
        </div>
        <div className="pt-4">
          <Button isLoading={isCreatingTask}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;

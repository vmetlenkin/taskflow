import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import Modal from "~/ui/Modal";
import Button from "~/ui/Button";
import { api } from "~/utils/api";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
};

const CreateProjectModal: React.FC<Props> = ({ open, setOpen, refetch }) => {
  const { handleSubmit, register, reset } = useForm();
  const { mutate: createBoard, isLoading } = api.board.create.useMutation({
    onSuccess: () => {
      refetch();
      reset();
      setOpen(false);
    }
  });

  const handleCreateTask: SubmitHandler<FieldValues> = (formData) => {
    createBoard({ title: formData.title });
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="mb-4 flex items-center justify-between pb-4">
        <span className="font-semibold">New project</span>
        <div
          className="cursor-pointer rounded-md p-1.5 hover:bg-zinc-200"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-4 w-4" />
        </div>
      </div>
      <form onSubmit={handleSubmit(handleCreateTask)}>
        <div className="mb-2 flex">
          <input
            {...register('title')}
            type="text"
            placeholder="Project name"
            className="w-full bg-transparent text-xl outline-none placeholder:text-zinc-500 font-semibold"
          />
          <div className="w-80" />
        </div>
        <div className="mb-4">
          <textarea
            {...register('text')}
            rows={4}
            placeholder="Add description..."
            className="w-full bg-transparent placeholder:text-zinc-500 outline-none"
          />
        </div>
        <div className="border-t border-zinc-200 pt-4">
          <Button isLoading={isLoading}>Create project</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;

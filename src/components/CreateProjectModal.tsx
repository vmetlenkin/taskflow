import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import Modal from "~/ui/Modal";

type Props = {
  column: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateTaskModal: React.FC<Props> = ({ open, setOpen, column }) => {
  const form = useForm();

  const handleCreateTask: SubmitHandler<FieldValues> = (formData) => {

    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-4">
        <span className="font-semibold">Новая задача</span>
        <div
          className="cursor-pointer rounded-md p-1.5 text-white hover:bg-zinc-800"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-4 w-4 " />
        </div>
      </div>
      <form onSubmit={form.handleSubmit(handleCreateTask)}>
        <div className="mb-2 flex">
          <input
            {...form.register('title')}
            type="text"
            placeholder="Название задачи"
            className="w-full bg-transparent text-xl font-semibold outline-none placeholder:text-zinc-500"
          />
          <div className="w-80" />
        </div>
        <div className="mb-4">
          <textarea
            {...form.register('text')}
            rows={8}
            placeholder="Добавьте описание..."
            className="w-full bg-transparent font-normal placeholder:text-zinc-500"
          />
        </div>
        <div className="border-t border-zinc-800 pt-4">
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-sm
              font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
              focus:ring-offset-2"
          >
            Создать задачу
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;

import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import Modal from "~/ui/Modal";
import { ITask, useKanbanStore } from "~/components/KanbanBoard/KanbanBoard.store";
import Button from "~/ui/Button";

const validationSchema = z.object({
  title: z.string().min(3, 'Title length must be 3 characters'),
  description: z.string().min(3, 'Description length must be 3 characters')
})

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const EditTaskModal: React.FC<Props> = ({ open, setOpen}) => {
  const {
    register,
    handleSubmit,
    formState,
    reset: resetFormFields,
    setValue
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema)
  });

  const {
    updateTask,
    selectedTaskId,
    setTask,
    task,
    removeTask
  } = useKanbanStore();

  const { isLoading: isTaskLoading } = api.board.getTaskByID.useQuery({ id: selectedTaskId }, {
    onSuccess: (task: ITask) => {
      setTask(task);
    }
  });

  const { mutate: updateTaskMutation, isLoading: isTaskUpdating } = api.board.updateTask.useMutation({
    onSuccess: (task: ITask) => {
      updateTask(task);
      setOpen(false);
      resetFormFields();
    }
  });

  const { mutate: removeTaskMutation, isLoading: isTaskRemoving } = api.board.removeTaskByID.useMutation({
    onSuccess: (task: ITask) => {
      removeTask(task);
      setOpen(false);
      resetFormFields();
    }
  });

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
    }
  }, [task]);

  const handleUpdateTask: SubmitHandler<ValidationSchema> = (formData) => {
    const updatedTask: ITask = {
      id: task.id,
      columnId: task.columnId,
      title: formData.title,
      description: formData.description,
      order: task.order,
    };

    updateTaskMutation(updatedTask);
  }

  const handleRemoveTask = () => {
    removeTaskMutation({ id: task!.id });
  }

  return (
    <Modal isLoading={isTaskLoading} open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleUpdateTask)}>
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
        <div className="flex space-x-2">
          <Button isLoading={isTaskUpdating}>Update Task</Button>
          <Button color="red" type="button" onClick={handleRemoveTask} isLoading={isTaskRemoving}>Remove Task</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
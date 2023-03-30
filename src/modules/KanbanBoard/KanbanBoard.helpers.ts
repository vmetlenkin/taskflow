import { LexoRank } from "lexorank";
import { ITask } from "~/modules/KanbanBoard/KanbanBoard.store";

export function getNewRank(
  sourceIndex: number,
  destinationIndex: number,
  tasks: ITask[],
  isDifferentColumn: boolean)
{
  if (!tasks.length) {
    return LexoRank.middle().toString();
  }

  if (destinationIndex === 0) {
    return LexoRank.parse(tasks[0].order!).genPrev().toString();
  }

  if (!isDifferentColumn && destinationIndex === tasks.length - 1) {
    return LexoRank.parse(tasks[tasks.length - 1].order)
      .genNext()
      .toString();
  }

  if (isDifferentColumn && destinationIndex === tasks.length) {
    return LexoRank.parse(tasks[tasks.length - 1].order)
      .genNext()
      .toString();
  }

  const tasksCopy = [...tasks];

  if (!isDifferentColumn) {
    tasksCopy.splice(sourceIndex, 1)
  }

  const previousRank = LexoRank.parse(tasksCopy[destinationIndex - 1].order);
  const nextRank = LexoRank.parse(tasksCopy[destinationIndex]!.order);
  return  previousRank.between(nextRank).toString();
}
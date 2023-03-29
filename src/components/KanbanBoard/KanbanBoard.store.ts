import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { DraggableLocation } from "@hello-pangea/dnd";

export interface BoardResponse {
  id: string;
  name: string;
  columns: IColumn[];
}

export interface ITask {
  id: string;
  columnId: string;
  title: string;
  description: string;
  order: string | null;
}

export interface IBoard {
  id: string;
  name: string;
  columns: {
    [column: string]: IColumn
  }
}

export interface IColumn {
  id: string;
  title: string;
  tasks?: ITask[];
  order: number | null;
}

interface KanbanState {
  board: IBoard | null;
  task: ITask | null,
  selectedColumnId: string;
  selectedColumnTaskNumber: number;
  selectedTaskId: string;
  setBoard: (board: BoardResponse) => void;
  setSelectedColumnId: (id: string) => void;
  setSelectedColumnTaskNumber: (number: number) => void;
  addTask: (task: ITask) => void;
  addColumn: (column: IColumn) => void;
  removeColumn: (column: IColumn) => void;
  moveTask: (source: DraggableLocation, destination: DraggableLocation) => void;
  updateTask: (task: ITask) => void;
  setSelectedTaskId: (id: string) => void;
  setTask: (task: ITask) => void;
  removeTask: (id: ITask) => void;
}

export const useKanbanStore = create<KanbanState>()(devtools(immer((set) => ({
  board: null,
  task: null,
  selectedColumnId: '',
  selectedColumnTaskNumber: -1,
  selectedTaskId: '',

  setBoard: (board) => {
    const columns = board.columns.reduce((acc, current) => {
      acc[current.id] = current;
      return acc;
    }, {});

    const result: IBoard = {
      id: board.id,
      name: board.name,
      columns: columns
    }
    set({ board: result });
  },

  setSelectedColumnId: (id) => set(state => {
    state.selectedColumnId = id;
  }),

  setSelectedColumnTaskNumber: (number) => set(state => {
    state.selectedColumnTaskNumber = number;
  }),

  addTask: (task) => set(state => {
    state.board.columns[task.columnId].tasks.push(task);
  }),

  addColumn: (column) => set(state => {
    state.board.columns[column.id] = { ...column };
  }),

  moveTask: (source, destination) => set(state => {
    const sourceColumn = state.board.columns[source.droppableId];
    const destinationColumn = state.board.columns[destination.droppableId];
    const itemMoved = { ...sourceColumn.tasks[source.index] };

    sourceColumn!.tasks.splice(source.index, 1);
    destinationColumn!.tasks.splice(destination.index, 0, itemMoved);
  }),

  updateTask: (task) => set(state => {
    const column = state.board.columns[task.columnId];
    const taskIndex = column.tasks.findIndex(t => t.id === task.id);
    column!.tasks[taskIndex] = task;
  }),

  setSelectedTaskId: (id) => set(state => {
    state.selectedTaskId = id;
  }),

  setTask: (task) => set(state => {
    state.task = task;
  }),

  removeTask: (task) => set(state => {
    const column = state.board.columns[task.columnId];
    column.tasks = column.tasks.filter(t => t.id !== task.id);
  }),

  removeColumn: (column) => set(state => {
    delete state.board.columns[column.id];
  })
}))));
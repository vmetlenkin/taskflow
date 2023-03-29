import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

export interface ITask {
  id: string;
  title: string;
  order: string;
}

export interface IBoard {
  [column: string]: {
    title: string;
    tasks: ITask[];
  }
}

interface KanbanState {
  board: IBoard;
  selectedColumnId: string;
  selectedColumnTaskNumber: number;
  setBoard: (board: any) => void;
  setSelectedColumnId: (id: string) => void;
  setSelectedColumnTaskNumber: (number: number) => void;
  addTask: (task: any) => void;
  addColumn: (column: any) => void;
  moveTask: (source: any, destination: any) => void;
}

export const useKanbanStore = create<KanbanState>()(devtools(immer((set) => ({
  board: {},
  selectedColumnId: '',
  selectedColumnTaskNumber: 0,

  setBoard: (board) => {
    const columns = board.columns.reduce((acc, current) => {
      acc[current.id] = current;
      return acc;
    }, {});
    set({ board: columns });
  },

  setSelectedColumnId: (id) => set(state => {
    state.selectedColumnId = id;
  }),

  setSelectedColumnTaskNumber: (number) => set(state => {
    state.selectedColumnTaskNumber = number;
  }),

  addTask: (task) => set(state => {
    state.board[task.columnId].tasks.push(task);
  }),

  addColumn: (column) => set(state => {
    state.board[column.id] = { ...column };
  }),

  moveTask: (source, destination) => set(state => {
    const itemMoved = { ...state.board[source.droppableId].tasks[source.index] };
    state.board[source.droppableId].tasks.splice(source.index, 1);
    state.board[destination.droppableId].tasks.splice(
      destination.index,
      0,
      itemMoved
    );
  })
}))));
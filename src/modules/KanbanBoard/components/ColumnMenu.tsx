import React from "react";
import Dropdown from "~/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { useKanbanStore } from "~/modules/KanbanBoard/KanbanBoard.store";
import { TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  id: string;
  showDeleteColumnModal: (show: boolean) => void;
};

const ColumnMenu: React.FC<Props> = ({ id, showDeleteColumnModal }) => {
  const { setSelectedColumnId } = useKanbanStore();

  const deleteColumn = () => {
    setSelectedColumnId(id);
    showDeleteColumnModal(true);
  }

  return (
    <Dropdown>
      <div className="px-1 py-1 ">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => deleteColumn()}
              className={`${
                active ? 'bg-indigo-500 text-white' : 'text-gray-900'
              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
            >
              {active ? (
                <TrashIcon
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
              ) : (
                <TrashIcon
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
              )}
              Delete
            </button>
          )}
        </Menu.Item>
      </div>
    </Dropdown>
  );
};

export default ColumnMenu;
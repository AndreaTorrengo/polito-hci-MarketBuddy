import "tailwindcss/tailwind.css";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { Card } from "@tremor/react";
import { LOCKED_ICON_PATH, IconLocker } from "./Icons.tsx";
import { UserData } from "./UserData.tsx";
import globalContext from "../../Context.tsx";

interface IconSelectorProps {
  icons: { id: number; path: string; }[];
  userdata: UserData;
  setUserdata: Dispatch<SetStateAction<UserData>>;
}

const IconSelector: React.FC<IconSelectorProps> = ({ icons, userdata, setUserdata }) => {
  const [selectedIcon, setSelectedIcon] = useState<number | null>(userdata.iconId);
  const iconLocker = new IconLocker();
  iconLocker.load();

  const { showToastMessage } = useContext(globalContext) || {};

  const handleIconClick = (icon: { id: number; locked: boolean }) => {
    if (!icon.locked) {
      setSelectedIcon(icon.id);
      setUserdata((userdata: UserData) => {
        const udCopy = Object.assign(new UserData(), userdata);
        udCopy.iconId = icon.id;
        return udCopy;
      });
    } else {
      showToastMessage && showToastMessage("You can buy this icon on the reward page", "info");
    }
  };

  return (
    <Card className="p-4 bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle rounded-lg">
      <div className="grid grid-cols-4 gap-4 place-items-center">
        {icons.map((icon) => {
          const index = iconLocker.getItemIndex(icon.id);
          let iconLItem;
          if (index < 0) {
            iconLItem = { id: icon.id, locked: true };
          } else
            iconLItem = iconLocker.lockingStatus[index];
          return (
            <div
              key={iconLItem.id}
              onClick={() => handleIconClick({ id: iconLItem.id, locked: iconLItem.locked })}
              className={`w-14 h-14 bg-tremor-background dark:bg-dark-tremor-background flex items-center justify-center rounded-lg transition cursor-pointer
            ${iconLItem.locked
                  ? "cursor-not-allowed"
                  : selectedIcon === icon.id
                    ? "border-4 border-tremor-brand"
                    : ""
                }`}
            >
              {iconLItem.locked ? (
                <div className="text-gray-400 w-8 h-8">
                  <img src={LOCKED_ICON_PATH} alt="locked" className='object-scale-down max-h-full m-auto' />
                </div>
              ) : selectedIcon === icon.id ? (
                <div className="w-12 h-12">
                  <img src={icon.path} alt={`icon-${icon.id}`} className='object-scale-down max-h-full m-auto' />
                </div>
              ) : (
                <div className="w-12 h-12">
                  <img src={icon.path} alt={`icon-${icon.id}`} className='object-scale-down max-h-full m-auto' />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default IconSelector;

// Example usage
// const icons = [
//   { id: 1, locked: false },
//   { id: 2, locked: false },
//   { id: 3, locked: true },
//   { id: 4, locked: false },
// ];
// <IconSelector icons={icons} onIconSelect={(id) => console.log("Selected icon:", id)} />

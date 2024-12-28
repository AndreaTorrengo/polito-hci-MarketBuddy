
// Icons
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Navbar(props: any) {
  const navigate = useNavigate();

  const tabs = [
    { id: 0, label: "Shopping", icon: <ShoppingBagIcon /> },
    { id: 1, label: "Quests", icon: props.questPendingClaims != 0 ?
      <div className="inline-block relative">
        <AssignmentIcon className="relative" />
        <span className="flex absolute h-3 w-3 top-2 right-0 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
      </div> :
      <AssignmentIcon /> },
    { id: 2, label: "Rewards", icon: <EmojiEventsIcon /> },
    { id: 3, label: "Profile", icon: <AccountCircleIcon /> },
  ];
  return (<>
    {/*<nav className="fixed bottom-0 left-0 right-0 bg-tremor-content-inverted dark:bg-dark-tremor-content-inverted shadow-md">*/}
    <nav className="pb-1 bg-tremor-content-inverted dark:bg-dark-tremor-content-inverted shadow-md">
      <ul className="flex justify-around">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex flex-col flex-grow items-center">
            <button
              onClick={() => {
                const tabIndex = tabs.findIndex(t => t.id === tab.id);
                props.setActiveTab(tabIndex);
                navigate(`${props.paths[tabIndex]}`);
              }}
              className={`w-full items-center py-1 px-4 
              ${props.activeTab === tab.id
                  ? "text-tremor-brand dark:text-dark-tremor-brand"
                  : "text-tremor-content dark:text-dark-tremor-content"
                } `}
            >
              <div className="flex flex-col">
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </>
  );
}
Navbar.propTypes = {
  paths: PropTypes.array,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func,
  questPendingClaims: PropTypes.number
}


/* Old MUI's navbar */
/* Dependencies:
 * >> https://mui.com/material-ui/getting-started/installation/
 * npm install @mui/material
 * npm install @emotion/react @emotion/styled
 * npm install @mui/icons-material
 */
// MUI material
//import BottomNavigation from "@mui/material/BottomNavigation";
//import BottomNavigationAction from "@mui/material/BottomNavigationAction";
/*return (
    <BottomNavigation
      showLabels
      value={props.activeTab}
      className="bg-tremor-content-inverted dark:bg-dark-tremor-content-inverted"
      onChange={(_event: any, newValue: any) => {
        props.setActiveTab(newValue);
        navigate(`${props.paths[newValue]}`);
      }}
    >
      <BottomNavigationAction
        label="Shopping" className="text-tremor-content dark:text-dark-tremor-content"
        icon={<ShoppingBagIcon/>}
      />
      <BottomNavigationAction label="Quests" className="text-tremor-content dark:text-dark-tremor-content" icon={
        props.questPendingClaims != 0 ?
          <div className="inline-block relative">
            <AssignmentIcon className="relative" />
            <span className="flex absolute h-3 w-3 top-1 right-0 -mt-1 -mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div> :
          <AssignmentIcon />
      } />
      <BottomNavigationAction label="Rewards" className="text-tremor-content dark:text-dark-tremor-content" icon={<EmojiEventsIcon />} />
      <BottomNavigationAction label="Profile" className="text-tremor-content dark:text-dark-tremor-content" icon={<AccountCircleIcon />} />
    </BottomNavigation>
  );*/
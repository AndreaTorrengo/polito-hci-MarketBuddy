/* Dependencies:
 * >> https://mui.com/material-ui/getting-started/installation/
 * npm install @mui/material
 * npm install @emotion/react @emotion/styled
 * npm install @mui/icons-material
 */

// MUI material
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// Icons
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./style.css";

export default function Navbar(props: any) {
  const navigate = useNavigate();

  return (
    <BottomNavigation
      showLabels
      value={props.activeTab}
      onChange={(_event: any, newValue: any) => {
        props.setActiveTab(newValue);
        navigate(`${props.paths[newValue]}`);
      }}
    >
      <BottomNavigationAction
        label="Shopping"
        icon={<ShoppingBagIcon />}
      />
      <BottomNavigationAction label="Quests" icon={
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
      <BottomNavigationAction label="Rewards" icon={<EmojiEventsIcon />} />
      <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
    </BottomNavigation>
  );
}
Navbar.propTypes = {
  paths: PropTypes.array,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func,
  questPendingClaims: PropTypes.number
}

/* 
<div className="mdc-tab-bar tabbar" role="tablist">
    <div className="mdc-tab-scroller">
      <div className="mdc-tab-scroller__scroll-area">
        <div className="mdc-tab-scroller__scroll-content">
          <button role="tab" className="mdc-tab mdc-tab--stacked mdc-ripple-upgraded mdc-tab--active tabbar-elm" aria-selected="true">
            <span className="mdc-tab__content">
              <span className="mdc-tab__icon material-icons" aria-hidden="true">shopping_bag</span>
              <span className="mdc-tab__text-label">Shopping List</span>
            </span>
            <span className="mdc-tab-indicator mdc-tab-indicator--active">
              <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span className="mdc-tab__ripple"></span>
          </button>

          <button role="tab" className="mdc-tab mdc-tab--stacked mdc-ripple-upgraded tabbar-elm" aria-selected="false">
            <span className="mdc-tab__content">
              <span className="mdc-tab__icon material-icons" aria-hidden="true">receipt_long</span>
              <span className="mdc-tab__text-label">Quests</span>
            </span>
            <span className="mdc-tab__ripple"></span>
          </button>

          <button role="tab" className="mdc-tab mdc-tab--stacked mdc-ripple-upgraded tabbar-elm" aria-selected="false">
            <span className="mdc-tab__content">
              <span className="mdc-tab__icon material-icons" aria-hidden="true">emoji_events</span>
              <span className="mdc-tab__text-label">Rewards</span>
            </span>
            <span className="mdc-tab__ripple"></span>
          </button>

          <button role="tab" className="mdc-tab mdc-tab--stacked mdc-ripple-upgraded tabbar-elm" aria-selected="false">
            <span className="mdc-tab__content">
              <span className="mdc-tab__icon material-icons" aria-hidden="true">emoji_events</span>
              <span className="mdc-tab__text-label">Profile</span>
            </span>
            <span className="mdc-tab__ripple"></span>
          </button>
          
        </div>
      </div>
    </div>
  </div>
 */

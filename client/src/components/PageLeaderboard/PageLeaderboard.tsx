import { Title } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import TopBar from "../generalPurposeComponents/TopBar";
import BackButton from "../generalPurposeComponents/BackButton";
import PropTypes from "prop-types";
import { DEFAULT_ICON_PATH, ICONS } from "../PageProfile/Icons";
import { UserData } from "../PageProfile/UserData";
import { Hexagon } from "lucide-react";

interface PageLeaderboardProps {
  userdata: UserData;
  setUserdata: Dispatch<SetStateAction<UserData>>;
}

export default function PageLeaderboard({ userdata, setUserdata }: Readonly<PageLeaderboardProps>) {
  const [activeTab, setActiveTab] = useState("Global");
  const user_exp = userdata.experience;
  const username = userdata.username;
  const userIconPath = UserData.getIconPath(userdata.iconId);
  const iconPaths = ICONS.map(i => i.path);

  const globalLeaderboard = [
    // Example data for global leaderboard
    { icon: DEFAULT_ICON_PATH, name: "Player570", position: 570, xp: user_exp + 15 },
    { icon: DEFAULT_ICON_PATH, name: "Player580", position: 580, xp: user_exp + 10 },
    { icon: DEFAULT_ICON_PATH, name: "Player590", position: 590, xp: user_exp + 5 },
    { icon: userIconPath, name: username, position: 600, xp: user_exp },
    { icon: DEFAULT_ICON_PATH, name: "Player610", position: 610, xp: user_exp - 15 },
    { icon: DEFAULT_ICON_PATH, name: "Player620", position: 620, xp: user_exp - 10 },
    { icon: DEFAULT_ICON_PATH, name: "Player630", position: 630, xp: user_exp - 5 },
  ];

  const top10Leaderboard = [
    // Example data for top 10 leaderboard
    { icon: iconPaths[7], name: "Player1", position: 1, xp: 25000 },
    { icon: iconPaths[2], name: "Player2", position: 2, xp: 24000 },
    { icon: DEFAULT_ICON_PATH, name: "Player3", position: 3, xp: 23000 },
    { icon: iconPaths[3], name: "Player4", position: 4, xp: 22000 },
    { icon: iconPaths[4], name: "Player5", position: 5, xp: 21000 },
    { icon: iconPaths[5], name: "Player6", position: 6, xp: 20000 },
    { icon: iconPaths[6], name: "Player7", position: 7, xp: 19000 },
    { icon: iconPaths[1], name: "Player8", position: 8, xp: 18000 },
    { icon: DEFAULT_ICON_PATH, name: "Player9", position: 9, xp: 17000 },
    { icon: DEFAULT_ICON_PATH, name: "Player10", position: 10, xp: 16000 },
  ];

  return (
    <div className='w-full h-full px-6 py-4'>
      <div className='flex justify-start gap-3 mb-4'>
        <div className='flex align-middle'>
          <BackButton />
        </div>
        <h1 className="page-title">Leaderboard</h1>
      </div>
      <div className="h-5/6 flex flex-col mt-4 p-4">
        {/* Tab Navigation */}
        {/* <div className="flex justify-center space-x-0 mb-4 rounded-md bg-tremor-border dark:bg-dark-tremor-border"> */}
        <button onClick={() => setActiveTab(activeTab === "Global" ? "Top 10" : "Global")} className="flex w-full place-self-center justify-center my-2 space-x-0 rounded-lg bg-tremor-border dark:bg-dark-tremor-border">
          <button disabled={activeTab === "Global"}
            className='w-1/4 px-4 py-2 rounded-lg z-[1] font-semibold uppercase bg-transparent text-center translate-x-1/2'
          >
            Global
          </button>
          <button
            disabled
            // hidden
            className={`w-1/2 h-full py-2 rounded-lg font-semibold uppercase bg-tremor-brand transition-transform duration-300 text-white ${activeTab === "Global"
              ? "-translate-x-1/2"
              : "translate-x-1/2"
              }`}
          >
          </button>
          <button disabled={activeTab === "Top 10"}
            className='w-1/4 px-4 py-2 rounded-lg z-[1] font-semibold whitespace-nowrap text-center uppercase bg-transparent -translate-x-1/2'
          >
            Top 10
          </button>
        </button>
        {/* <button
            onClick={() => setActiveTab("Global")}
            className={`w-full pl-4 py-2 rounded-md text-base font-semibold transition-colors uppercase ${activeTab === "Global"
              ? "bg-tremor-brand dark:bg-dark-tremor-brand text-white"
              : "bg-tremor-border dark:bg-dark-tremor-border text-gray-700 dark:text-gray-400"
              }`}
          >
            Global
          </button>
          <button
            onClick={() => setActiveTab("Top 10")}
            className={`w-full pr-4 py-2 rounded-md text-base font-semibold transition-colors uppercase ${activeTab === "Top 10"
              ? "bg-tremor-brand dark:bg-dark-tremor-brand text-white"
              : "bg-tremor-border dark:bg-dark-tremor-border text-gray-700 dark:text-gray-400"
              }`}
          >
            Top 10
          </button> */}
        {/* </div> */}

        {/* Leaderboard List */}
        <div className="flex-1 overflow-auto">
          <ul key={"leaderboard-list"} className="h-full overflow-y-auto space-y-2">
            {activeTab === "Global" ?
              globalLeaderboard.map((player) => <LeaderboardItem key={player.position} player={player} currentPlayer={username} />) :
              top10Leaderboard.map((player) => <LeaderboardItem key={player.position} player={player} currentPlayer={username} />)
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

function LeaderboardItem(props: any) {
  return (
    <li
      key={`li-${props.player.position}`}
      className={`flex justify-between items-center p-3 shadow rounded-md ${props.player.name == props.currentPlayer ? 'bg-tremor-brand-muted dark:bg-dark-tremor-brand-muted' :
        'bg-tremor-background-muted dark:bg-dark-tremor-background-muted'}
   `}>
      <div className="flex items-center space-x-4">
        <div className="justify-items-center">
          {/* <span className="text-xl">{props.player.icon}</span> */}
          <div className="w-8 h-8">
            <img src={props.player.icon} className='object-scale-down max-h-full m-auto' />
          </div>
          <span className="font-semibold block text-xs">
            {props.player.position}
          </span>
        </div>
        <span className="font-medium">{props.player.name}</span>
      </div>
      <div className="text-right">
        <span className="flex font-semibold gap-1 text-[var(--experience)] dark:text-[var(--dark-experience)]">{props.player.xp} <Hexagon /></span>
      </div>
    </li>);
}
LeaderboardItem.propTypes = {
  player: PropTypes.object,
  currentPlayer: PropTypes.string
}
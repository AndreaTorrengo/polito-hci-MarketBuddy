import { Title } from "@tremor/react";
import { useState } from "react";
import HexagonIcon from '@mui/icons-material/Hexagon';
import TopBar from "../generalPurposeComponents/TopBar";
import BackButton from "../generalPurposeComponents/BackButton";
import PropTypes from "prop-types";

export default function PageLeaderboard() {
  const [activeTab, setActiveTab] = useState("Global");

  const globalLeaderboard = [
    // Example data for global leaderboard
    { icon: "👤", name: "Player57", position: 57, xp: 1255 },
    { icon: "👤", name: "Player58", position: 58, xp: 1250 },
    { icon: "👤", name: "Player59", position: 59, xp: 1245 },
    { icon: "👤", name: "You", position: 60, xp: 1240 },
    { icon: "👤", name: "Player61", position: 61, xp: 1235 },
    { icon: "👤", name: "Player62", position: 62, xp: 1230 },
    { icon: "👤", name: "Player63", position: 63, xp: 1225 },
  ];

  const top10Leaderboard = [
    // Example data for top 10 leaderboard
    { icon: "👾", name: "Player1", position: 1, xp: 2500 },
    { icon: "👽", name: "Player2", position: 2, xp: 2400 },
    { icon: "👸", name: "Player3", position: 3, xp: 2300 },
    { icon: "🍇", name: "Player4", position: 4, xp: 2200 },
    { icon: "👩", name: "Player5", position: 5, xp: 2100 },
    { icon: "👜", name: "Player6", position: 6, xp: 2000 },
    { icon: "👑", name: "Player7", position: 7, xp: 1900 },
    { icon: "🍓", name: "Player8", position: 8, xp: 1800 },
    { icon: "🍏", name: "Player9", position: 9, xp: 1700 },
    { icon: "🍉", name: "Player10", position: 10, xp: 1600 },
  ];

  return <>
    <div className="flex flex-col w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle p-6">
      <div className="flex flex-row w-full">
        <TopBar
          leftComponent={<BackButton />}
          centerComponent={<Title className="text-left text-4xl">Leaderboard</Title>}
        />
      </div>
      <div className="flex flex-col mt-16 overflow-hidden bg-tremor-content-inverted dark:bg-dark-tremor-content-inverted p-4 shadow-md rounded-lg">
        {/* Tab Navigation */}
        <div className="flex justify-center space-x-0 mb-4 rounded-md bg-tremor-border dark:bg-dark-tremor-border">
          <button
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
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-hidden">
          <ul key={"leaderboard-list"} className="h-full overflow-y-auto space-y-2">
            {activeTab === "Global" ?
              globalLeaderboard.map((player) => <LeaderboardItem key={player.position} player={player} />) :
              top10Leaderboard.map((player) => <LeaderboardItem key={player.position} player={player} />)
            }
          </ul>
        </div>
      </div>
    </div>
  </>;
}

function LeaderboardItem(props: any) {
  return (
    <li
      key={`li-${props.player.position}`}
      className={`flex justify-between items-center p-3 shadow rounded-md ${props.player.name == 'You' ? 'bg-tremor-brand-muted dark:bg-dark-tremor-brand-muted' :
        'bg-tremor-background-muted dark:bg-dark-tremor-background-muted'}
   `}>
      <div className="flex items-center space-x-4">
        <div className="justify-items-center">
          <span className="text-xl">{props.player.icon}</span>
          <span className="font-semibold block text-xs">
            {props.player.position}
          </span>
        </div>
        <span className="font-medium">{props.player.name}</span>
      </div>
      <div className="text-right">
        <span className="font-semibold text-violet-600">{props.player.xp} <HexagonIcon /></span>
      </div>
    </li>);
}
LeaderboardItem.propTypes = {
  player: PropTypes.object
}
import { Title } from "@tremor/react";
import { useState } from "react";
import HexagonIcon from '@mui/icons-material/Hexagon';
import TopBar from "../generalPurposeComponents/TopBar";
import BackButton from "../generalPurposeComponents/BackButton";
import PropTypes from "prop-types";

export default function PageLeaderboard(props: any) {
  const [activeTab, setActiveTab] = useState("Global");
  const user_exp = props.userdata.experience;
  const username = props.userdata.username;

  const globalLeaderboard = [
    // Example data for global leaderboard
    { icon: "👤", name: "Player570", position: 570, xp: user_exp + 15 },
    { icon: "👤", name: "Player580", position: 580, xp: user_exp + 10 },
    { icon: "👤", name: "Player590", position: 590, xp: user_exp + 5 },
    { icon: "👤", name: username, position: 600, xp: user_exp },
    { icon: "👤", name: "Player610", position: 610, xp: user_exp - 15 },
    { icon: "👤", name: "Player620", position: 620, xp: user_exp - 10 },
    { icon: "👤", name: "Player630", position: 630, xp: user_exp - 5  },
  ];

  const top10Leaderboard = [
    // Example data for top 10 leaderboard
    { icon: "👾", name: "Player1", position: 1, xp: 25000 },
    { icon: "👽", name: "Player2", position: 2, xp: 24000 },
    { icon: "👸", name: "Player3", position: 3, xp: 23000 },
    { icon: "🍇", name: "Player4", position: 4, xp: 22000 },
    { icon: "👩", name: "Player5", position: 5, xp: 21000 },
    { icon: "👜", name: "Player6", position: 6, xp: 20000 },
    { icon: "👑", name: "Player7", position: 7, xp: 19000 },
    { icon: "🍓", name: "Player8", position: 8, xp: 18000 },
    { icon: "🍏", name: "Player9", position: 9, xp: 17000 },
    { icon: "🍉", name: "Player10", position: 10, xp: 16000 },
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
              globalLeaderboard.map((player) => <LeaderboardItem key={player.position} player={player} currentPlayer={username} />) :
              top10Leaderboard.map((player) => <LeaderboardItem key={player.position} player={player} currentPlayer={username} />)
            }
          </ul>
        </div>
      </div>
    </div>
  </>;
}
PageLeaderboard.propTypes = {
  userdata: PropTypes.object,
  setUserdata: PropTypes.func,
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
  player: PropTypes.object,
  currentPlayer: PropTypes.string
}
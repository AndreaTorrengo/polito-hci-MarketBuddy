import { ProgressBar, Card, Title, Text } from "@tremor/react";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { Button } from "@mui/material";
import StatPopup from "../generalPurposeComponents/StatPopup";
import { quest_array, getNewQuestId, getAndSaveNewQuestId, getCurrentQuests, saveCurrentQuests } from './Quests';
import { UserData } from "../PageProfile/UserData";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to parse the progress string
const parseProgress = (progress: any) => {
  const [current, total] = progress.split("/").map(Number);
  return (current / total) * 100;
};

export default function PageQuest(props: any) {
  // Number of quests to generate. Must be < than quest_array length
  const N_QUESTS: number = 3;
  // Initial quests
  const [quests, setQuests] = useState(getCurrentQuests(N_QUESTS));
  const [newQuestId, setNewQuestId] = useState(getNewQuestId());
  const navigate = useNavigate();

  // Effect triggered by state change of "quests"
  useEffect(() => {
    props.setQuestPendingClaims((_oldValue: number) => {
      return quests.filter((q: any) => q.completed).length;
    });
  }, [quests]);

  // Handle claiming a quest
  const handleClaim = (questToClaim: any) => {
    // Add a new quest to the same position of the one claimed
    // Find index of the claimed quest
    // let qindex = quests.map((q: any) => q.id).indexOf(id);
    // if (qindex < 0) qindex = 0;

    // Saves on localstorage and get the new value of newQuestId
    let newGeneratedId = getAndSaveNewQuestId(newQuestId);

    setQuests((prevQuests: any) => {
      let newQuests = [
        ...prevQuests.map((quest: any) => {
          if (quest.id !== questToClaim.id)
            return quest;
          else {
            return quest_array.find((q: any) => q.id === newGeneratedId);
          }
        })];
      saveCurrentQuests(newQuests);
      return newQuests;
    });
    setNewQuestId(() => newGeneratedId);

    // Update stats
    props.setUserdata((userdata: any) => {
      //let udCopy = userdata.clone();
      const udCopy = Object.assign(new UserData(), userdata);
      udCopy.incrCoins(questToClaim.coins);
      udCopy.incrExperience(questToClaim.exp);
      return udCopy;
    });
    /*let userdata: UserData = props.userdata.current;
    console.log(props.userdata.current);
    userdata.incrCoins(questToClaim.coins);
    userdata.incrExperience(questToClaim.exp);*/
  };
  // Hard-coding for make a quest claimable
  const requestClaim = (id: Number) => {
    setQuests((prevQuests: any) => {
      let newQuests = [...prevQuests.map((q: any) => {
        const questTotalProgress = q.progress.split('/')[1];
        return q.id === id ? { ...q, 'progress': `${questTotalProgress}/${questTotalProgress}`, 'completed': true } : q;
      })];
      saveCurrentQuests(newQuests);
      return newQuests;
    });
  };

  return (
    <>
      <StatPopup coins={props.userdata.coins} exp={props.userdata.experience} />
      <div className="w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle p-6">
        <Title className="text-center text-4xl mb-6">Quests</Title>
        <div className="flex flex-col gap-4 relative">
          {quests.map((quest: any) =>
            <div id={`${quest.id}`} key={quest.id}
              // slide-in transition when rendering quests
              className={`relative bg-tremor-background dark:bg-dark-tremor-background shadow-md rounded-lg overflow-hidden transform transition-all duration-500 animate-slide-in`}
              onClick={() => {
                if (quest.completed) {
                  handleClaim(quest);
                } else requestClaim(quest.id);
              }}
            >
              <Card className="bg-tremor-background dark:bg-dark-tremor-background p-4 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <div className="flex items-center space-x-1 text-violet-600">
                    <HexagonIcon />
                    <span className="font-semibold">{quest.exp}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <EmojiEmotionsIcon />
                    <span className="font-semibold">{quest.coins}</span>
                  </div>
                </div>

                <Title>{quest.title}</Title>
                <Text className="mt-1">{quest.description}</Text>
                <div className="relative mt-2">
                  <ProgressBar
                    className="[&>div]:h-6"
                    value={parseProgress(quest.progress)}
                    color="blue"
                  />
                  <span className="absolute inset-0 flex justify-center items-center text-white font-semibold">
                    {quest.progress}
                  </span>
                </div>
                <div className={`${quest.completed ? 'mt-1' : 'mt-6'} flex justify-center`}>
                  {/*quest.completed && <Text className="animate-quest-pulse text-tremor-brand dark:text-dark-tremor-brand-emphasis">Click to claim!</Text>*/}
                  {quest.completed && <Text className="text-tremor-brand dark:text-dark-tremor-brand-emphasis">Click to claim!</Text>}
                </div>
              </Card>
            </div>
          )}
        </div>
        <div className="absolute left-0 bottom-20 flex flex-col items-center w-full">
          <Button
            variant="contained"
            color="primary"
            className="flex items-center justify-start gap-2"
            onClick={() => {
              navigate(props.leaderboardPath);
            }}
          >
            <LeaderboardIcon fontSize="medium" />
            <span className="text-base font-semibold">Leaderboard</span>
          </Button>
        </div>
      </div>
    </>
  );
}
PageQuest.propTypes = {
  setQuestPendingClaims: PropTypes.func,
  leaderboardPath: PropTypes.string,
  userdata: PropTypes.object,
  setUserdata: PropTypes.func,
}
import { ProgressBar, Card, Title, Text } from "@tremor/react";
import StatPopup from "../generalPurposeComponents/StatPopup";
import { quest_array, getNewQuestId, getAndSaveNewQuestId, getCurrentQuests, saveCurrentQuests } from './Quests';
import { UserData } from "../PageProfile/UserData";
import { Coins, Crown, Hexagon } from 'lucide-react'

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../generalPurposeComponents/Button";

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
    const newGeneratedId = getAndSaveNewQuestId(newQuestId);

    setQuests((prevQuests: any) => {
      const newQuests = [
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
    props.setUserdata((userdata: UserData) => {
      //let udCopy = userdata.clone();
      const udCopy = Object.assign(new UserData(), userdata);
      udCopy.incrCoins(questToClaim.coins);
      udCopy.incrExperience(questToClaim.exp);
      return udCopy;
    });
  };
  // Hard-coding for make a quest claimable
  const requestClaim = (id: number) => {
    setQuests((prevQuests: any) => {
      const newQuests = [...prevQuests.map((q: any) => {
        const questTotalProgress = q.progress.split('/')[1];
        return q.id === id ? { ...q, 'progress': `${questTotalProgress}/${questTotalProgress}`, 'completed': true } : q;
      })];
      saveCurrentQuests(newQuests);
      return newQuests;
    });
  };

  return (
    <>
      <StatPopup coins={props.userdata.coins} exp={props.userdata.experience} popup={true} />
      <div className="w-full h-full px-6 py-4">
        <h1 className="page-title mb-4">Quests</h1>
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
              <Card className="bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle p-4 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <div className="flex items-center space-x-1 text-[var(--experience)] dark:text-[var(--dark-experience)]">
                    <Hexagon />
                    <span className="font-semibold">{quest.exp}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[var(--buddy-coins)] dark:text-[var(--dark-buddy-coins)]">
                    <Coins />
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
                  <span className="absolute inset-0 flex justify-center items-center  font-semibold">
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
            className="flex items-center gap-2 text-xl"
            onClick={() => {
              navigate(props.leaderboardPath);
            }}
          >
            <Crown size={30} />
            <span className="font-semibold">Leaderboard</span>
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
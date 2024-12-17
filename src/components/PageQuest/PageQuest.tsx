import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar, Card, Title, Text } from "@tremor/react";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { Button } from "@mui/material";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// Helper function to parse the progress string
const parseProgress = (progress: any) => {
  const [current, total] = progress.split("/").map(Number);
  return (current / total) * 100;
};

export default function PageQuest(props: any) {
  // Initial quests
  const [quests, setQuests] = useState([
    { id: 1, title: "Traveller", description: "Visit 2 vendors", progress: "2/2", completed: true },
    { id: 2, title: "Hiker", description: "Walk for 1000m", progress: "128/1000", completed: false },
    { id: 3, title: "Outside the Box", description: "Visit a vendor off the planned path", progress: "0/1", completed: false },
  ]);
  const [newQuestId, setNewQuestId] = useState(4);

  // Effect triggered by state change of "quests"
  useEffect(() => {
    props.setQuestPendingClaims((_oldValue: number) => {
      return quests.filter(q => q.completed).length;
    });
  }, [quests]);

  // Handle claiming a quest
  const handleClaim = (id: number) => {
    // Add a new quest to the same position of the one claimed
    // Find index of the claimed quest
    let qindex = quests.map(q => q.id).indexOf(id);
    if (qindex < 0) qindex = 0;

    setQuests((prevQuests) => [
      ...prevQuests.map((quest) => quest.id !== id ? quest :
        {
          id: newQuestId,
          title: `New Sample Quest #${newQuestId}`,
          description: "This is a brand-new quest.",
          progress: "0/1",
          completed: false,
        },
      )]);
    setNewQuestId((prevId) => prevId + 1);
  };
  // Hard-coding for make a quest claimable
  const requestClaim = (id: Number) => {
    setQuests((prevQuests) => [...prevQuests.map(q => {
      const questTotalProgress = q.progress.split('/')[1];
      return q.id === id ? { ...q, 'progress': `${questTotalProgress}/${questTotalProgress}`, 'completed': true } : q;
    })]);
  };

  return (
    <>
      <div className="w-full h-full bg-gray-800 p-6">
        <Title className="text-center text-4xl mb-6">Quests</Title>
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {quests.map((quest) =>
              quest.completed ? (
                // Note: use layout prop for smooth sorting
                <motion.div
                  key={quest.id}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{
                    duration: 0.3
                  }}
                  layout
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                  onClick={() => handleClaim(quest.id)}
                >
                  <Card className="p-4 relative">
                    <div className="absolute top-2 right-2 flex space-x-4">
                      <div className="flex items-center space-x-1 text-violet-600">
                        <HexagonIcon />
                        <span className="font-semibold">5</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <EmojiEmotionsIcon />
                        <span className="font-semibold">10</span>
                      </div>
                    </div>

                    <Title>{quest.title}</Title>
                    <Text>{quest.description}</Text>
                    <div className="relative mt-4">
                      <ProgressBar
                        className="[&>div]:h-6"
                        value={parseProgress(quest.progress)}
                        color="blue"
                      />
                      <span className="absolute inset-0 flex justify-center items-center text-white font-semibold">
                        {quest.progress}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center animate-pulse">
                      <Title>Click to claim!</Title>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div key={quest.id}>
                  <Card className="p-4 relative" onClick={() => requestClaim(quest.id)}>
                    <div className="absolute top-2 right-2 flex space-x-4">
                      <div className="flex items-center space-x-1 text-violet-600">
                        <HexagonIcon />
                        <span className="font-semibold">5</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <EmojiEmotionsIcon />
                        <span className="font-semibold">10</span>
                      </div>
                    </div>

                    <Title>{quest.title}</Title>
                    <Text>{quest.description}</Text>
                    <div className="relative mt-4">
                      <ProgressBar
                        className="[&>div]:h-6"
                        value={parseProgress(quest.progress)}
                        color="blue"
                      />
                      <span className="absolute inset-0 flex justify-center items-center text-white font-semibold">
                        {quest.progress}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center">

                    </div>
                  </Card>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
        <div className="absolute left-0 bottom-20 flex flex-col items-center w-full shadow-lg">
          <Button
            variant="contained"
            color="primary"
            className="flex items-center justify-start gap-2"
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
  setQuestPendingClaims: PropTypes.func
}

/*
<h3>Quests</h3>
      <Stack
        direction="column"
        spacing={3}
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        
      </Stack>
*/
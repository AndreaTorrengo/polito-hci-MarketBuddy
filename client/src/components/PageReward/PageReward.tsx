import { useEffect, useState } from 'react';
import API from '../../API';
import { List, ListItem } from '@tremor/react';
import { Reward } from '../../models';

export default function PageReward() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // Fetch rewards
    API.getRewards()
      .then((rewards) => {
        console.log(rewards);
        setRewards(rewards);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <List>
        {rewards.map((reward: Reward) => (
          <ListItem key={reward.id}>
            <div>{reward.icon}</div>
            <div>{reward.description}</div>
            <div>{reward.cost}</div>
          </ListItem>
        ))}
      </List>
    </>
  );
}

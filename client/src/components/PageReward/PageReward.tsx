import { useEffect, useState } from 'react';
import API from '../../API';
import { Reward } from '../../models';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { LocalOfferOutlined } from '@mui/icons-material';
import planet from '/src/assets/planet03.png';

const iconsMap = {
  'coupon': <LocalOfferOutlined />,
  'profile_picture': <img src={planet} className='object-scale-down max-h-full m-auto' />,
}

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <div className='flex justify-between items-center h-10'>
      <div className='h-10 flex items-center'>
        {iconsMap[reward.icon] || <p>reward.icon</p>}
      </div>
      <div className='mx-4 flex items-center'>
        <p>{reward.description}</p>
      </div>
      <div className='flex items-center'>
        <p>{reward.cost} <EmojiEmotionsIcon className='text-yellow-500' /></p>
      </div>
    </div>
  );
}

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
      <h1>Rewards</h1>
      <div className='flex content-center justify-around'>
        <ul className='flex flex-col gap-4 items-center'>
          {rewards.map((reward: Reward) => (
            <li key={reward.id} className='w-full align-middle'>
              <RewardCard reward={reward} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import API from '../../API';
import { Reward } from '../../models';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { LocalOfferOutlined } from '@mui/icons-material';
import planet from "../../assets/planet03.png";

const iconsMap: { [key: string]: JSX.Element } = {
  'coupon': <LocalOfferOutlined className='object-scale-down max-h-full m-auto' />,
  'profile_picture': <img src={planet} alt="planet" className='object-scale-down max-h-full m-auto' />,
}

function RewardCard({ reward, askConfirmation }: Readonly<{ reward: Reward, askConfirmation: Function }>) {
  const redeemReward = () => {
    askConfirmation(() => { console.log("Redeemed ", reward.description) }, "Are you sure you want to redeem '" + reward.description + "' for " + reward.cost + " coins?");
  }

  return (
    <button className='flex justify-between w-full h-full items-center py-2 px-4 rounded-tremor-default bg-tremor-background-muted dark:bg-dark-tremor-background-muted animated active:brightness-75 dark:active:brightness-125' onClick={() => redeemReward()}>
      <div className='flex'>
        <div className='h-10 w-10 flex items-center'>
          {iconsMap[reward.icon] || <p>{reward.icon}</p>}
        </div>
        <div className='mx-5 flex items-center '>
          <p>{reward.description}</p>
        </div>
      </div>
      <div className='flex items-center ms-8'>
        <p>{reward.cost}</p>
        <EmojiEmotionsIcon className='ms-2 text-yellow-500' />
      </div>
    </button>
  );
}

export default function PageReward({ askConfirmation }) {
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
              <RewardCard reward={reward} askConfirmation={askConfirmation} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

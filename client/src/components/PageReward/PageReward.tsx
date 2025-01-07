import { useEffect, useState } from 'react';
import API from '../../API';
import { Reward } from '../../models';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { LocalOfferOutlined } from '@mui/icons-material';
import planet from "../../assets/planet03.png";
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import { useNavigate } from 'react-router-dom';

const iconsMap: { [key: string]: JSX.Element } = {
  'coupon': <LocalOfferOutlined className='object-scale-down max-h-full m-auto' />,
  'profile_picture': <img src={planet} alt="planet" className='object-scale-down max-h-full m-auto' />,
}



export function RewardCard({ reward, confirmRewardRedemption = () => { } }: Readonly<{ reward: Reward, confirmRewardRedemption?: (reward: Reward) => void }>) {

  return (
    <button className='flex justify-between w-full h-full items-center py-2 px-4 rounded-tremor-default bg-tremor-background-muted dark:bg-dark-tremor-background-muted animated active:brightness-75 dark:active:brightness-125' onClick={() => confirmRewardRedemption(reward)}>
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

type AskConfirmation = (callback: () => void, message: string) => void;

export default function PageReward({ askConfirmation }: Readonly<{ askConfirmation: AskConfirmation }>) {
  const [rewards, setRewards] = useState([]);
  const navigate = useNavigate();

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

  const redeemReward = (reward: Reward) => {
    API.redeemReward(reward.id);
    // TODO - Add a feedback to confirm the operation was successful
    setRewards((prevRewards) => prevRewards.filter((r) => r.id !== reward.id));
  }

  const confirmRewardRedemption = (reward: Reward) => {
    askConfirmation(() => { redeemReward(reward); }, "Are you sure you want to redeem '" + reward.description + "' for " + reward.cost + " coins?");
  }

  return (
    <>
      <h1>Rewards</h1>
      <div className='flex content-center justify-around'>
        <button className='absolute top-4 right-4' onClick={() => navigate('history')}>
          <RestoreOutlinedIcon />
        </button>
        <ul className='flex flex-col gap-4 items-center'>
          {rewards.map((reward: Reward) => (
            <li key={reward.id} className='w-full align-middle'>
              <RewardCard reward={reward} confirmRewardRedemption={confirmRewardRedemption} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

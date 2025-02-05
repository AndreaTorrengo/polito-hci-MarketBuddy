import { useContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import API from '../../API';
import { Reward } from '../../models';
import { useNavigate } from 'react-router-dom';
import globalContext from '../../Context';
import StatPopup from '../generalPurposeComponents/StatPopup';
import { UserData } from '../PageProfile/UserData';
import { ICONS, IconLocker } from '../PageProfile/Icons';
import { Tag, History, Coins } from 'lucide-react';

const iconsMap: { [key: string]: JSX.Element } = {
  'coupon': <Tag className='object-scale-down max-h-full m-auto' />,
  'profile_picture_2': <img src={ICONS.find(i => i.id == 2)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
  'profile_picture_3': <img src={ICONS.find(i => i.id == 3)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
  'profile_picture_4': <img src={ICONS.find(i => i.id == 4)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
  'profile_picture_5': <img src={ICONS.find(i => i.id == 5)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
  'profile_picture_6': <img src={ICONS.find(i => i.id == 6)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
  'profile_picture_7': <img src={ICONS.find(i => i.id == 7)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
  'profile_picture_8': <img src={ICONS.find(i => i.id == 8)?.path} alt="planet" className='object-scale-down max-h-full m-auto' />,
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
        <Coins color='var(--buddy-coins)' className='ms-2' />
      </div>
    </button>
  );
}


export default function PageReward({ userdata, setUserdata }: Readonly<{ userdata: UserData, setUserdata: Dispatch<SetStateAction<UserData>> }>) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const navigate = useNavigate();

  const { askConfirmation, showToastMessage } = useContext(globalContext) ?? {};

  useEffect(() => {
    // Fetch rewards
    API.getRewards()
      .then((rewards) => {
        setRewards(rewards);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const redeemReward = (reward: Reward) => {
    API.redeemReward(reward.id);
    // Feedback to confirm the operation was successful: update the user's coins
    setUserdata((userdataObj: UserData) => {
      const udCopy = Object.assign(new UserData(), userdataObj);
      udCopy.incrCoins(-reward.cost);
      return udCopy;
    });
    // If the redeemed reward is a profile picture, unlock it
    if (reward.icon.includes('profile_picture')) {
      const iconId = parseInt(reward.icon.split('_')[2]);
      const iconLocker = new IconLocker();
      iconLocker.load();
      iconLocker.unlock(iconId);
    }

    // setRewards((prevRewards) => prevRewards.filter((r: Reward) => r.id !== reward.id));
    setRewards((prevRewards) => prevRewards.filter((r) => r.id !== reward.id));
    showToastMessage && showToastMessage("Reward redeemed successfully!", "success");
  }

  const confirmRewardRedemption = (reward: Reward) => {
    if(reward.cost <= userdata.coins)
      askConfirmation && askConfirmation(() => { redeemReward(reward); }, "Are you sure you want to redeem '" + reward.description + "' for " + reward.cost + " coins?");
    else
      showToastMessage && showToastMessage("You don't have enough buddy-coins to redeem this reward. You can earn more by completing quests or buying some products!", "error");
  }

  return (
    <div className='w-full h-full px-6 py-4'>
      <div className='flex justify-between mb-4'>
        <h1 className="page-title">Rewards</h1>
        <StatPopup coins={userdata.coins} exp={userdata.experience} popup={false} />
        <div className='flex'>
          <button onClick={() => navigate('history')}>
            <History />
          </button>
        </div>
      </div>
      <div className='flex content-center justify-between'>
        <ul className='flex flex-col gap-4 w-full'>
          {rewards.map((reward: Reward) => (
            <li key={reward.id} className=''>
              <RewardCard reward={reward} confirmRewardRedemption={confirmRewardRedemption} />
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
}

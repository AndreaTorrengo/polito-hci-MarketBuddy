import { useContext, Dispatch, SetStateAction, useState } from 'react';
import { Reward } from '../../models.tsx';
import globalContext from '../../Context.tsx';
import StatPopup from '../generalPurposeComponents/StatPopup.tsx';
import { UserData } from '../PageProfile/UserData.tsx';
import { ICONS, IconLocker } from '../PageProfile/Icons.tsx';
import { Tag, History, Coins, ArrowLeft } from 'lucide-react';

import rewardsJSON from '../../assets/rewards.json' with { type: "json" };

const rewardsData: Reward[] = rewardsJSON;

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
    <button className={`flex justify-between w-full h-full items-center py-2 px-4 rounded-tremor-default bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle animated ${!reward.redeemed && "active:brightness-75 dark:active:brightness-125"}`} onClick={() => confirmRewardRedemption(reward)}>
      <div className='flex'>
        <div className='h-10 w-10 flex items-center'>
          {iconsMap[reward.icon] || <p>{reward.icon}</p>}
        </div>
        <div className='mx-5 flex items-center '>
          <p>{reward.description}</p>
        </div>
      </div>
      <div className='flex items-center ms-8 text-[var(--buddy-coins)] dark:text-[var(--dark-buddy-coins)]'>
        <p>{reward.cost}</p>
        <Coins className='ms-2' />
      </div>
    </button>
  );
}


export default function PageReward({ userdata, setUserdata }: Readonly<{ userdata: UserData, setUserdata: Dispatch<SetStateAction<UserData>> }>) {
  const [rewards, setRewards] = useState<Reward[]>(rewardsData.map(reward => {
    const redeemedRewards = JSON.parse(localStorage.getItem('rewards') ?? '{}');
    return {
      ...reward,
      redeemed: !!redeemedRewards[reward.id]
    };
  }));

  const [showHistory, setShowHistory] = useState(false);

  const { askConfirmation, showToastMessage } = useContext(globalContext) ?? {};

  const redeemReward = (reward: Reward) => {
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
    setRewards((prevRewards) => prevRewards.map((r: Reward) => r.id === reward.id ? { ...r, redeemed: true } : r));
    localStorage.setItem('rewards', JSON.stringify({ ...JSON.parse(localStorage.getItem('rewards') ?? '{}'), [reward.id]: true }));
    showToastMessage && showToastMessage("Reward redeemed successfully!", "success");
  }

  const confirmRewardRedemption = (reward: Reward) => {
    if (reward.cost <= userdata.coins)
      askConfirmation && askConfirmation(() => { redeemReward(reward); }, "Are you sure you want to redeem '" + reward.description + "' for " + reward.cost + " coins?");
    else
      showToastMessage && showToastMessage("You don't have enough buddy-coins to redeem this reward. You can earn more by completing quests or buying some products!", "info");
  }

  return (
    <div className='w-full h-full px-4 pt-4'>
      <div className='flex justify-between gap-3 mb-4'>
        {showHistory ?
          <h1 className='page-title'>
            <button onClick={() => setShowHistory(false)}>
              <ArrowLeft />
            </button>
            <span className='ms-2'>
              Redeemed
            </span>
          </h1>
          :
          <h1 className='page-title'>Rewards</h1>
        }
        <div className='flex'>
          {!showHistory && <button onClick={() => setShowHistory(true)}>
            <History />
          </button>}
          <StatPopup className="pl-1.5" coins={userdata.coins} exp={userdata.experience} popup={false} />
        </div>
      </div>
      <div className='flex content-center justify-between items-center'>
        {
          !showHistory ?
            <ul className='flex flex-col gap-4 w-full'>
              {rewards.filter(r => !r.redeemed).map((reward: Reward) => (
                <li key={reward.id}>
                  <RewardCard reward={reward} confirmRewardRedemption={confirmRewardRedemption} />
                </li>))}
            </ul>
            :
            (
              rewards.filter(r => r.redeemed).length > 0 ?
                <ul className='flex flex-col gap-4 w-full'>
                  {rewards.filter(r => r.redeemed).map((reward: Reward) => (
                    <li key={reward.id}>
                      <RewardCard reward={reward} />
                    </li>))}
                </ul>
                :
                <span className='flex items-center text-center text-3xl align-middle mt-80'>You haven't redeemed any reward yet</span>
            )
        }

      </div>
    </div >
  );
}

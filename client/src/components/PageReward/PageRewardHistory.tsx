import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Reward } from "../../models";
import API from "../../API";
import { useEffect, useState } from "react";
import { RewardCard } from './PageReward'

export default function PageRewardHistory() {
    const [rewards, setRewards] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch rewards
        API.getRedeemedRewards()
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
            <h1>Redeemed Rewards</h1>
            <div className='flex content-center justify-around'>
                <button className='absolute top-4 left-4' onClick={() => navigate(-1)}>
                    <ArrowBackOutlinedIcon />
                </button>
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
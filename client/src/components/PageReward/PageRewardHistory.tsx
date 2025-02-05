import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Reward } from "../../models";
import API from "../../API";
import { useEffect, useState } from "react";
import { RewardCard } from './PageReward'
import { Title } from "@tremor/react";

export default function PageRewardHistory() {
    const [rewards, setRewards] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch rewards
        API.getRedeemedRewards()
            .then((rewards) => {
                setRewards(rewards);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    return (
        <div className='w-full h-full px-6 py-4'>
            <div className='flex justify-start gap-3 mb-4'>
                <div className='flex align-middle'>
                    <button onClick={() => navigate(-1)}>
                        <ArrowBackOutlinedIcon />
                    </button>
                </div>
                <h1 className="page-title">Redeemed Rewards</h1>
            </div>
            <div className='flex content-center justify-between'>
                <ul className='flex flex-col gap-4 w-full'>
                    {rewards.map((reward: Reward) => (
                        <li key={reward.id} className=''>
                            <RewardCard reward={reward} />
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    );
}
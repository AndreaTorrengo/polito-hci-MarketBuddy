import { useEffect, useState } from "react";
import { Card } from "@tremor/react";
//import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { 
    ArrowUpward, 
    ArrowDownward
} from "@mui/icons-material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HexagonIcon from '@mui/icons-material/Hexagon';

type Props = {
  coins: number;
  exp: number;
};

export default function StatPopup({ coins, exp }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);
  const [prevExp, setPrevExp] = useState(exp);

  useEffect(() => {
    if (coins !== prevCoins || exp !== prevExp) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide after 3 sec
      setPrevCoins(coins);
      setPrevExp(exp);
    }
  }, [coins, exp, prevCoins, prevExp]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 transition-transform duration-300 ease-in-out ${
        showPopup ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"
      }`}
    >
      <Card className="p-4 bg-white shadow-lg border rounded-xl flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <span className="text-violet-600"><HexagonIcon /></span>
          <span
            className={`flex items-center transition-all duration-300 ${
              exp >= prevExp ? "text-violet-600" : "text-red-600"
            }`}
          >
            {exp >= prevExp ? <ArrowUpward /> : <ArrowDownward />}
            {exp}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <span className="text-yellow-500"><EmojiEmotionsIcon /></span>
          <span
            className={`flex items-center transition-all duration-300 ${
              coins >= prevCoins ? "text-yellow-500" : "text-red-600"
            }`}
          >
            {coins >= prevCoins ? <ArrowUpward /> : <ArrowDownward />}
            {coins}
          </span>
        </div>
      </Card>
    </div>
  );
}

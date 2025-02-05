import { useEffect, useState, useRef } from "react";
import { Card } from "@tremor/react";
import { ArrowUp, ArrowDown, Hexagon, Coins } from "lucide-react";
import PropTypes from "prop-types";

type Props = {
  coins: number;
  exp: number;
  popup: boolean;
};

// Function to animate numbers
const animateValue = (start: number, end: number, setter: (val: number) => void) => {
  return new Promise<void>((resolve) => {
    if (start == end) {
      resolve();
      return;
    }
    let current = start;
    const step = start < end ? 1 : -1;
    const timePerStep = 1500 / (Math.abs(end - start) + 1);

    const interval = setInterval(() => {
      current += step;
      setter(current);
      if (current == end) {
        clearInterval(interval);
        resolve();
      }
    }, timePerStep); // Adjust speed of counting animation
    // console.log(timePerStep);
  });
};

export default function StatPopup({ coins, exp, popup }: Props) {
  const countDownRef = useRef(0); // use for popup auto dismiss
  const [showPopup, setShowPopup] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);
  const [prevExp, setPrevExp] = useState(exp);
  const [displayCoins, setDisplayCoins] = useState(coins);
  const [displayExp, setDisplayExp] = useState(exp);

  useEffect(() => {
    if (coins !== prevCoins || exp !== prevExp) {
      //console.log(exp + " " + prevExp);
      //console.log(coins + " " + prevCoins);
      countDownRef.current += 1;
      setShowPopup(true);

      Promise.all([
        animateValue(prevCoins, coins, setDisplayCoins),
        animateValue(prevExp, exp, setDisplayExp),
      ]).then(() => {
        setTimeout(() => {
          countDownRef.current -= 1;
          // Close the popup only if there are no other changes to coins and experience
          if (countDownRef.current <= 0)
            setShowPopup(false);
          /*else
            setShowPopup(true);*/
        }, 1000); // Hide once values are stable, after 1 sec
      });
      setPrevCoins(coins);
      setPrevExp(exp);
    }
  }, [coins, exp]);

  return (
    <>
      {popup ?
        <div
          className={`fixed z-10 top-5 right-5 transition-all duration-700 ease-in-out pointer-events-none transform ${showPopup ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-5 opacity-0"
            }`}
        >
          <Card className="p-4 bg-white shadow-lg border rounded-xl flex flex-col space-y-2 transition-opacity duration-1000">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Hexagon color="var(--experience)" />
              <span
                className={`flex items-center transition-all duration-300 ${exp >= prevExp ? "text-[var(--experience)]" : "text-red-600"
                  }`}
              >
                {exp >= prevExp ? <ArrowUp /> : <ArrowDown />}
                {displayExp}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Coins color="var(--buddy-coins)" />
              <span
                className={`flex items-center transition-all duration-300 ${coins >= prevCoins ? "text-[var(--buddy-coins)]" : "text-red-600"
                  }`}
              >
                {coins >= prevCoins ? <ArrowUp /> : <ArrowDown />}
                {displayCoins}
              </span>
            </div>
          </Card>
        </div>
        :
        <div className="">
          <Card className="p-4 bg-white shadow-lg rounded-xl flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Coins color="var(--buddy-coins)" />
              <span
                className={`flex items-center transition-all duration-300 ${coins >= prevCoins ? "text-[var(--buddy-coins)]" : "text-red-600"
                  }`}
              >
                {showPopup ? <ArrowDown /> : <span></span>}
                {displayCoins}
              </span>
            </div>
          </Card>
        </div>}
    </>
  );
}
StatPopup.propTypes = {
  coins: PropTypes.number,
  exp: PropTypes.number,
  popup: PropTypes.bool,  // Choose between showing a popup or static <div>
}
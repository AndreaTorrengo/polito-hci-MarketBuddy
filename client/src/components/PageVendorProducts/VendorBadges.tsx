import iconPath from '../../assets/positiveReview.svg';

interface VendorBadgesProps {
    market: string;
}

export default function VendorBadges({market}: VendorBadgesProps) {
    return (
        <div className="flex flex-wrap w-full gap-6">
            <div className="flex items-center justify-center" onClick={() => {
            }}>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                     width="1.5em" height="1.5em" viewBox="0 0 101.000000 94.000000"
                     preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,94.000000) scale(0.100000,-0.100000)"
                       fill="#000000" stroke="none">
                        <path d="M445 851 c-119 -29 -215 -146 -215 -260 0 -80 76 -244 178 -385 73
-102 90 -113 125 -86 34 27 138 183 187 279 52 104 67 175 51 245 -33 146
-183 241 -326 207z m126 -200 c21 -22 29 -39 29 -66 0 -51 -44 -95 -95 -95
-51 0 -95 44 -95 95 0 27 8 44 29 66 22 21 39 29 66 29 27 0 44 -8 66 -29z"/>
                    </g>
                </svg>
                <p className="m-0 p-0">{market}</p>
            </div>
            <div className="flex items-center justify-center" onClick={() => {
            }}>
                <p className="m-0 p-0">89%</p>
                <img src={iconPath} alt="Positive Review Icon"/>
            </div>
        </div>
    );
}
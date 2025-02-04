import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SavingsIcon from '@mui/icons-material/Savings';

interface VendorBadgesProps {
    market: string;
    quality: string;
    cordiality: string;
    convenience: string;
}

export default function VendorBadges({ market, quality, cordiality, convenience }: VendorBadgesProps) {
    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex items-center justify-left" onClick={() => {
            }}>
                <LocationOnOutlinedIcon />
                <p className="m-0 p-0">{market}</p>
            </div>
            <div className='flex flex-row items-center justify-around'>
                <div className="w-1/3 flex flex-col items-center justify-center" onClick={() => {
                }}>
                    <WorkspacePremiumIcon sx={{ color: "#4b72a6" }} />
                    <p className="m-0 px-1 text-sm font-light">Quality</p>
                    <p className="m-0 p-0 font-bold">{quality}</p>
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center" onClick={() => {
                }}>
                    <SentimentSatisfiedAltIcon sx={{ color: "#e3c144" }} />
                    <p className="m-0 px-1 text-sm font-light">Cordiality</p>
                    <p className="m-0 p-0 font-bold">{cordiality}</p>
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center" onClick={() => {
                }}>
                    <SavingsIcon sx={{ color: "#52a36a" }} />
                    <p className="m-0 px-1 text-sm font-light">Convenience</p>
                    <p className="m-0 p-0 font-bold">{convenience}</p>
                </div>
            </div>
        </div>
    );
}
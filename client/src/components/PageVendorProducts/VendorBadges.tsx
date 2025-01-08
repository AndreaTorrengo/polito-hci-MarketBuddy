import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

interface VendorBadgesProps {
    market: string;
}

export default function VendorBadges({market}: VendorBadgesProps) {
    return (
        <div className="flex flex-wrap w-full gap-6">
            <div className="flex items-center justify-center" onClick={() => {
            }}>
                <LocationOnOutlinedIcon />
                <p className="m-0 p-0">{market}</p>
            </div>
            <div className="flex items-center justify-center" onClick={() => {
            }}>
                <p className="m-0 pe-1">89%</p>
                <ThumbUpAltIcon />
            </div>
        </div>
    );
}

import { PiggyBank, Award, Smile, MapPin } from 'lucide-react';

interface VendorBadgesProps {
    market: string;
    quality: string;
    cordiality: string;
    convenience: string;
    changeTab?: (tab?: string) => void;
    positionCallback?: () => void;
}

export default function VendorBadges({ market, quality, cordiality, convenience, changeTab, positionCallback }: Readonly<VendorBadgesProps>) {
    return (
        <div className="flex flex-col w-full gap-6">
            <button className="flex items-center justify-left font-medium" onClick={() => {
                positionCallback && positionCallback();
                changeTab && changeTab("map");
            }}>
                <MapPin />
                <p className="m-0 p-0">{market}</p>
            </button>
            <div className='flex flex-row items-center justify-around'>
                <div className="w-1/3 flex flex-col items-center justify-center">
                    <Award color="var(--quality)" />
                    <p className="m-0 px-1 text-sm font-light">Quality</p>
                    <p className="m-0 p-0 font-bold">{quality}</p>
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center" >
                    <Smile color="var(--cordiality)" />
                    <p className="m-0 px-1 text-sm font-light">Cordiality</p>
                    <p className="m-0 p-0 font-bold">{cordiality}</p>
                </div>
                <div className="w-1/3 flex flex-col items-center justify-center" >
                    <PiggyBank color="var(--convenience)" />
                    <p className="m-0 px-1 text-sm font-light">Convenience</p>
                    <p className="m-0 p-0 font-bold">{convenience}</p>
                </div>
            </div>
        </div>
    );
}
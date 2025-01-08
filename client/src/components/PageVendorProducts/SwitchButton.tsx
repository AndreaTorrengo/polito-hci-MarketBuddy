import SmallIconButton from "../generalPurposeComponents/SmallIconButton";

export default function SwitchButton() {
    return (
        <SmallIconButton onClick={() => {}}>
            <div className="flex items-center justify-center h-5 w-5 text-black dark:text-white">
                <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10L21 7M21 7L18 4M21 7H7M6 14L3 17M3 17L6 20M3 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </SmallIconButton>
    );
}
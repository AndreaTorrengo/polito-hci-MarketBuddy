import { IconButton } from "@mui/material";

export default function SwitchButton() {
    return (
        <IconButton
            onClick={
                () => {
                }
            }
        >
            <div className="flex items-center justify-center h-5 w-5">
                <svg width="2.5rem" height="2.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10L21 7M21 7L18 4M21 7H7M6 14L3 17M3 17L6 20M3 17H17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </IconButton>
    );
}
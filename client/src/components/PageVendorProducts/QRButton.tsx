import {Button} from "@mui/material";

export default function QRButton() {
    return (
        <Button
            variant="contained"
            color="primary"
            className="w-full"
        >
            <div className="flex items-center justify-center gap-2 w-full" onClick={() => {
            }}>
                <p className="m-0 p-0 pt-0.5"> <span className="font-bold">{"Show QR Code "}</span> to confirm purchase</p>
            </div>
        </Button>
    );
}
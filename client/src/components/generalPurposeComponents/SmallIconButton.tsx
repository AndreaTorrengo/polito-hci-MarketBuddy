import { IconButton } from "@mui/material";

interface SmallIconButtonProps {
    onClick?: () => void;
}

export default function SmallIconButton({ onClick, children }: React.PropsWithChildren<SmallIconButtonProps>) {
    return (
        <div className="flex items-center justify-center">
            <IconButton
                style={{ height: "2rem", width: "2rem" }}
                onClick={onClick}
            >
                {children}
            </IconButton>
        </div>
    );
}

import { Plus } from "lucide-react";
import { Button } from "../generalPurposeComponents/Button.tsx";

interface AddProductsButtonProps {
    onClick: () => void;
}

export default function AddProductsButton({onClick}: Readonly<AddProductsButtonProps>) {

    return (
        <Button className="h-fit py-2" variant="outlined" color="primary" onClick={onClick} >
            <div className="flex items-center justify-center gap-2 whitespace-nowrap" >
                <p className="text-xs uppercase">Add Product/s</p>
                <Plus size={20} />
            </div>
        </Button>
    );
}
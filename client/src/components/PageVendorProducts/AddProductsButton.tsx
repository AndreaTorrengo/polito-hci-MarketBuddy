import { useNavigate } from "react-router-dom";
import { Button } from "../generalPurposeComponents/Button";

export default function AddProductsButton() {
    const navigate = useNavigate();

    return (
        <Button className="h-fit m-auto py-2" variant="outlined" color="primary" onClick={() => navigate("/addProducts")} >
            <div className="flex items-center justify-center gap-2 whitespace-nowrap" >
                <p className="text-xs uppercase">Add Product/s</p>
                <i>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4v16m8-8H4" />
                    </svg>
                </i>
            </div>
        </Button>
    );
}
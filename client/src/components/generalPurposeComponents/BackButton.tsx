import { ArrowLeft } from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button className="flex items-center justify-center" onClick={() => navigate(-1)}>
            <i>
                <ArrowLeft />
            </i>
        </button>
    );
}
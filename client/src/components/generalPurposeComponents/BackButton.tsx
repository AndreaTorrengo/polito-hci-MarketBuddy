import {useNavigate} from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button className="flex items-center justify-center" onClick={() => navigate(-1)}>
            <i>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7"/>
                </svg>
            </i>
        </button>
    );
}
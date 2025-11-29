import { ImSpinner2 } from "react-icons/im";

export default function LoadingScreen() {
    return (
        <div className={`flex justify-center items-center w-full h-full min-h-screen max-w-screen`}>
            <ImSpinner2 size={50} className="text-primary animate-spin" />
        </div>
    )
}
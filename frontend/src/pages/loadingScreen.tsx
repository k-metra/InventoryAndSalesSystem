import { ImSpinner2 } from "react-icons/im";

export default function LoadingScreen() {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-background">
            <ImSpinner2 size={50} className="text-primary animate-spin" />
        </div>
    )
}
import { ImSpinner2 } from "react-icons/im";

export default function LoadingScreen({ fullscreen }: { fullscreen?: boolean }) {
    return (
        <div className={`flex justify-center items-center ${fullscreen ? "w-screen h-screen" : "w-full h-full"}`}>
            <ImSpinner2 size={50} className="text-primary animate-spin" />
        </div>
    )
}
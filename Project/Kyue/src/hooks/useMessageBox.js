import { useEffect } from "react";
import { useState } from "react";

const useMessageBox = (timer = 5000, animationTime = 0) => {
    const [boxActive, setBoxActive] = useState(false);
    const [boxText, setBoxText] = useState("")

    useEffect(() => {
        if (!boxActive && boxText !== "") {
            setBoxText(boxText)
            setBoxActive(true);
            setTimeout(() => {
                setBoxActive(false);
                if(animationTime === 0)
                    setBoxText("")
            }, timer);
            if(animationTime > 0)
                setTimeout(() => {
                    setBoxText("")
                }, animationTime + timer);
        }
    }, [boxText])
    return [boxText, boxActive, setBoxText]
}

export default useMessageBox;
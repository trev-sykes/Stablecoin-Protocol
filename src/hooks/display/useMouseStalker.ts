import { useState, useEffect } from "react"
const useRenderMouseStalker = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [pointerStalker, setPointerStalker] = useState<HTMLDivElement | any>(null);

    const createMouseStalker = () => {
        if (pointerStalker) return;
        const element = document.createElement("div");
        element.id = 'pointerStalker';
        element.style.position = "absolute";
        element.style.width = "10px";
        element.style.height = "10px";
        element.style.borderRadius = "50%";
        element.style.background = "rgba(0,0,0,.25)";
        element.style.pointerEvents = "none";
        document.body.appendChild(element);
        return element;
    };

    const handleMouseMovement = (e: MouseEvent) => {
        const x = e.pageX;
        const y = e.pageY;
        setPosition({ x, y });
    };

    useEffect(() => {
        const element = createMouseStalker(); // Create the stalker element
        setPointerStalker(element);

        // Attach the mousemove event listener once
        const onMouseMove = (e: MouseEvent) => handleMouseMovement(e);
        window.addEventListener("mousemove", onMouseMove);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    useEffect(() => {
        if (pointerStalker) {
            pointerStalker.style.top = `${position.y - 5}px`; // Adjust for center position
            pointerStalker.style.left = `${position.x - 5}px`; // Adjust for center position
        }
    }, [position, pointerStalker]);


}
export { useRenderMouseStalker };
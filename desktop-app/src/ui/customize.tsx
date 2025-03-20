import { useEffect, useState } from "react";
import { Mapping } from "../../types";

function Customize() {

    const [mappings, setMappings] = useState<Mapping[]>([]);

    useEffect(() => {
        window.electron.getControllerMappings((mappings) => {
            console.log("Current Mappings:", mappings);
            setMappings(mappings);
        });

    }, []);

    useEffect(() => {
        window.electron.setControllerMappings(mappings);
    }, [mappings]);

    return (
        <div className="customize">
        <h1>Customize</h1>
        </div>
    );
}

export default Customize;
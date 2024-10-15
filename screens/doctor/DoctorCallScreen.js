import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import SingleCall from "../../components/sections/SingleCall";
import { SafeAreaView } from "react-native-safe-area-context";
import { css } from "../../assets/styles";
import DoubleCall from "../../components/sections/DoubleCall";
import BufferScreen from "../../components/sections/BufferScreen";

export default function DoctorCallScreen() {
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsBuffering(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);
    return (
        isBuffering ? <BufferScreen /> : <DoubleCall />
    )
}

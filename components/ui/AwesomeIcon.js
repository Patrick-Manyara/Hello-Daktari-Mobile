import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function AwesomeIcon({
  iconName,
  iconColor,
  iconStyle,
  iconSize,
}) {
  return <FontAwesomeIcon style={iconStyle} size={iconSize} icon={iconName} color={iconColor} />;
}

import React from "react";
import { SpeedDial, SpeedDialAction, styled } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

// SpeedDialTemplate component for rendering a speed dial with actions
const SpeedDialTemplate = ({ actions }) => {
  return (
    // CustomSpeedDial component with specified properties
    <CustomSpeedDial
      ariaLabel="SpeedDial playground example" // Aria label for accessibility
      icon={<TuneIcon />} // Icon to display on the speed dial button
      direction="left" // Direction in which actions will appear
    >
      {/* Map through the actions array and render a SpeedDialAction for each */}
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name} // Unique key for each action
          icon={action.icon} // Icon for the action
          tooltipTitle={action.name} // Tooltip text for the action
          onClick={action.action} // Function to call when the action is clicked
        />
      ))}
    </CustomSpeedDial>
  );
};

export default SpeedDialTemplate;

// Styled component for customizing the SpeedDial
const CustomSpeedDial = styled(SpeedDial)`
  .MuiSpeedDial-fab {
    background: linear-gradient(135deg, #0077D4 0%, #00A3FF 100%);
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 119, 212, 0.4);

    &:hover {
      background: linear-gradient(135deg, #0060aa 0%, #008be5 100%);
      box-shadow: 0 6px 24px rgba(0, 163, 255, 0.6);
    }
  }

  .MuiSpeedDialAction-fab {
    background: rgba(13, 22, 41, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f8fafc;
    &:hover {
      background: rgba(13, 22, 41, 1);
      border-color: rgba(0, 163, 255, 0.4);
    }
  }
`;

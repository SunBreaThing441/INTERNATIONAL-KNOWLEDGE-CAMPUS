import styled from "styled-components";
import { Button } from "@mui/material";

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

export const DarkBlueButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #0077D4 0%, #00569E 100%);
    color: #FFFFFF;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.02em;
    padding: 10px 24px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 18px rgba(0, 119, 212, 0.35);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: linear-gradient(135deg, #0088F5 0%, #0066B8 100%);
      box-shadow: 0 8px 24px rgba(0, 119, 212, 0.55);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

export const BlueButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #0077D4 0%, #0099FF 100%);
    color: #FFFFFF;
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 8px 20px;
    box-shadow: 0 4px 16px rgba(0, 119, 212, 0.3);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: linear-gradient(135deg, #0088F5 0%, #29B6F6 100%);
      box-shadow: 0 6px 22px rgba(0, 119, 212, 0.5);
      transform: translateY(-1px);
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #00C49F 0%, #059669 100%);
    color: #FFFFFF;
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 20px;
    box-shadow: 0 4px 16px rgba(0, 196, 159, 0.35);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: linear-gradient(135deg, #10B981 0%, #047857 100%);
      box-shadow: 0 6px 22px rgba(0, 196, 159, 0.55);
      transform: translateY(-1px);
    }
  }
`;

export const PurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
    color: #FFFFFF;
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: linear-gradient(135deg, #818CF8 0%, #4338CA 100%);
      box-shadow: 0 6px 22px rgba(99, 102, 241, 0.55);
      transform: translateY(-1px);
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    background: rgba(99, 102, 241, 0.15);
    color: #A5B4FC;
    border: 1px solid rgba(99, 102, 241, 0.35);
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    padding: 8px 18px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: rgba(99, 102, 241, 0.25);
      color: #FFFFFF;
      border-color: rgba(99, 102, 241, 0.6);
    }
  }
`;

export const RedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: #FFFFFF;
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    padding: 6px 16px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: linear-gradient(135deg, #F87171 0%, #B91C1C 100%);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
    }
  }
`;

export const DarkRedButton = styled(Button)`
  && {
    background: rgba(239, 68, 68, 0.15);
    color: #F87171;
    border: 1px solid rgba(239, 68, 68, 0.35);
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    padding: 6px 16px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #FFFFFF;
      border-color: rgba(239, 68, 68, 0.6);
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    background: rgba(255, 255, 255, 0.08);
    color: #E2E8F0;
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-weight: 600;
    text-transform: none;
    border-radius: 10px;
    padding: 8px 20px;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
`;

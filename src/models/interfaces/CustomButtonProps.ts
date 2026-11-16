import { ButtonProps } from "@mui/material";
import { ReactNode } from "react";

export interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  background?: string;
  textColor?: string;
  textColorHover?: string;
  hoverColor?: string;
  borderRadius?: number;
  label: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
  sx?: object;
  width?: string | number;
  type?: "button" | "submit" | "reset";
  border?: string;
  padding?: string;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

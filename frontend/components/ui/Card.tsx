import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

const Card: React.FC<CardProps> = ({
  width = "360px",
  height = "fit-content",
  className,
  style,
  children,
  ...rest
}) => {
  const computedStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: width,
    ...style,
  };

  if (height && height !== "fit-content" && height !== "auto") {
    computedStyle.minHeight = height;
  }

  return (
    <div
      className={cn(
        "rounded-bl-3xl rounded-tr-3xl bg-pr_w p-6 text-pr_dg",
        className,
      )}
      style={computedStyle}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCard({
  children,
  containerClassName,
  className,
  as: Tag = "div",
  duration = 1,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");

  const rotateDirection = (currentDirection) => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap = {
    TOP: "radial-gradient(70% 90% at 50% 0%, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FF6B00 75%, #E6A800 100%)",
    LEFT: "radial-gradient(60% 70% at 0% 50%, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FF6B00 75%, #E6A800 100%)",
    BOTTOM:
      "radial-gradient(70% 90% at 50% 100%, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FF6B00 75%, #E6A800 100%)",
    RIGHT:
      "radial-gradient(60% 70% at 100% 50%, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FF6B00 75%, #E6A800 100%)",
  };

  const highlight =
    "radial-gradient(150% 250% at 50% 50%, #FFD700 0%, #FFA500 15%, #FF8C00 35%, #FF6B00 55%, #E6A800 75%, #CC9900 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-2xl content-center bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 hover:from-yellow-500/30 hover:via-amber-500/30 hover:to-yellow-500/30 transition duration-500 dark:from-yellow-400/30 dark:via-amber-400/30 dark:to-yellow-400/30 dark:hover:from-yellow-400/40 dark:hover:via-amber-400/40 dark:hover:to-yellow-400/40 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      style={{
        boxShadow: hovered 
          ? '0 4px 8px rgba(255, 215, 0, 0.15), 0 2px 4px rgba(255, 215, 0, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.1)'
          : '0 2px 4px rgba(255, 215, 0, 0.1), 0 1px 2px rgba(255, 215, 0, 0.05), 0 0 0 1px rgba(255, 215, 0, 0.05)'
      }}
      {...props}
    >
      <div
        className={cn(
          "w-full text-foreground z-10 bg-card px-4 py-5 rounded-[inherit] border border-yellow-500/20",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(0.5px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-card absolute z-1 flex-none inset-[2px] rounded-2xl" />
    </Tag>
  );
}

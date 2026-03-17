import { Star } from "lucide-react";
import React from "react";

const Rating = ({ value = 0, size = 15 }) => {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            value > i
              ? "text-amber-400 fill-amber-400"
              : "text-slate-300 fill-slate-200"
          }
        />
      ))}
    </div>
  );
};

export default Rating;
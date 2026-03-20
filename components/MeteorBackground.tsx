import React from "react";

type MeteorStyle = {
  left: string;
  animationDelay: string;
  animationDuration: string;
};

export const MeteorBackground = ({
  number = 20,
}: {
  number?: number;
}) => {
  const meteorStyles = React.useMemo<MeteorStyle[]>(() => {
    return Array.from({ length: number || 20 }, () => ({
      left: `${Math.floor(Math.random() * 800) - 400}px`,
      animationDelay: `${(Math.random() * 0.6 + 0.2).toFixed(2)}s`,
      animationDuration: `${Math.floor(Math.random() * 8) + 2}s`,
    }));
  }, [number]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {meteorStyles.map((style, idx) => (
        <span
          key={`meteor-${idx}`}
          className={
            "animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]" +
            " before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
          }
          style={{
            top: 0,
            ...style,
          }}
        />
      ))}
    </div>
  );
};

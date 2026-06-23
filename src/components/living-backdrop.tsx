import type { CSSProperties } from "react";

const leaves = [
  { x: "6%", y: "18%", s: "18px", r: "-22deg", d: "7s", o: 0.42 },
  { x: "18%", y: "72%", s: "13px", r: "18deg", d: "8.4s", o: 0.3 },
  { x: "36%", y: "12%", s: "11px", r: "-8deg", d: "6.8s", o: 0.26 },
  { x: "58%", y: "78%", s: "16px", r: "26deg", d: "9.1s", o: 0.32 },
  { x: "76%", y: "20%", s: "14px", r: "-18deg", d: "7.8s", o: 0.36 },
  { x: "91%", y: "62%", s: "17px", r: "12deg", d: "8.8s", o: 0.28 },
] as const;

export function LivingBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/40 to-transparent" />
      {leaves.map((leaf) => (
        <span
          key={`${leaf.x}-${leaf.y}`}
          className="leaf-mote"
          style={
            {
              "--x": leaf.x,
              "--y": leaf.y,
              "--s": leaf.s,
              "--r": leaf.r,
              "--d": leaf.d,
              "--o": leaf.o,
            } as CSSProperties
          }
        />
      ))}
      <div className="root-line bottom-[9%] left-[8%] rotate-[8deg]" />
      <div className="root-line bottom-[14%] right-[2%] rotate-[-12deg]" />
    </div>
  );
}

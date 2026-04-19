import { SiPython, SiReact, SiSharp, SiSwift, SiUnity } from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { Bot, CircuitBoard, Cog, HandHeart, Tag } from "lucide-react";
import type { SVGProps } from "react";

const baseCn = "size-[1em] shrink-0 text-current";

function RosDotsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden {...props}>
      {[
        [2, 2],
        [7, 2],
        [12, 2],
        [2, 7],
        [7, 7],
        [12, 7],
        [2, 12],
        [7, 12],
        [12, 12],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.35} fill="currentColor" />
      ))}
    </svg>
  );
}

export function TagTypeIcon({
  tag,
  className,
}: {
  tag: string;
  className?: string;
}) {
  const cn = [baseCn, className].filter(Boolean).join(" ");
  switch (tag.trim()) {
    case "Python":
      return <SiPython className={cn} aria-hidden />;
    case "Unity":
      return <SiUnity className={cn} aria-hidden />;
    case "Swift":
      return <SiSwift className={cn} aria-hidden />;
    case "C#":
      return <SiSharp className={cn} aria-hidden />;
    case "React":
      return <SiReact className={cn} aria-hidden />;
    case "React Native":
      return <TbBrandReactNative className={cn} aria-hidden />;
    case "Outreach":
      return <HandHeart className={cn} strokeWidth={2} aria-hidden />;
    case "Embedded Systems/IoT":
      return <CircuitBoard className={cn} strokeWidth={2} aria-hidden />;
    case "CAD/Fabrication":
      return <Cog className={cn} strokeWidth={2} aria-hidden />;
    case "Robotics":
      return <Bot className={cn} strokeWidth={2} aria-hidden />;
    case "ROS":
    case "ROS2":
      return <RosDotsIcon className={cn} />;
    default:
      return <Tag className={cn} strokeWidth={2} aria-hidden />;
  }
}

import { SVGAttributes } from "preact";
import { PageDimensions } from "../types";

export type PrintGuidesProps = {
  dimensions: PageDimensions;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

const ROTATIONS = {
  "top-left": 0,
  "top-right": 90,
  "bottom-right": 180,
  "bottom-left": 270,
} as const;

const IMAGE_SIZE_MM = 20;
const STROKE_WIDTH = 2.5;

export const PrintGuides = ({ dimensions, position }: PrintGuidesProps) => {
  const rotation = ROTATIONS[position];
  const viewboxSize = IMAGE_SIZE_MM * 10;
  const innerDimension = dimensions.margin * 10;
  const outerDimension = (dimensions.margin + dimensions.bleed) * 10;
  const thinStroke = STROKE_WIDTH;

  const location = {
    left: position.includes("left") ? 0 : undefined,
    right: position.includes("right") ? 0 : undefined,
    top: position.includes("top") ? 0 : undefined,
    bottom: position.includes("bottom") ? 0 : undefined,
  };

  return (
    <div
      className="print-guides-overlay"
      style={{ rotate: `${rotation}deg`, ...location }}
    >
      <svg
        viewBox={`0 0 ${viewboxSize} ${viewboxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical trim */}
        <DoubleLine
          x1={outerDimension}
          y1="0"
          x2={outerDimension}
          y2={innerDimension + (dimensions.bleed * 10) / 2}
          stroke="black"
          stroke-width={thinStroke}
          thickWidth={thinStroke * 2}
        />
        {/* Horizontal trim */}
        <DoubleLine
          x1="0"
          y1={outerDimension}
          x2={innerDimension + (dimensions.bleed * 10) / 2}
          y2={outerDimension}
          stroke="black"
          stroke-width={thinStroke}
          thickWidth={thinStroke * 2}
        />

        {/* Horizontal Bleed */}
        <line
          x1={innerDimension}
          y1={innerDimension}
          x2="0"
          y2={innerDimension}
          stroke="black"
          stroke-width={thinStroke}
          stroke-dasharray="2,2"
        />
        {/* Vertical Bleed */}
        <line
          x1={innerDimension}
          y1={innerDimension}
          x2={innerDimension}
          y2="0"
          stroke="black"
          stroke-width={thinStroke}
          stroke-dasharray="2,2"
        />
      </svg>
    </div>
  );
};

function DoubleLine(
  props: SVGAttributes<SVGLineElement> & { thickWidth: number },
) {
  return (
    <>
      <line {...props} stroke="#eee" stroke-width={props.thickWidth} />
      <line {...props} />
    </>
  );
}

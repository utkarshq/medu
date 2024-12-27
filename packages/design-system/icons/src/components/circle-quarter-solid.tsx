import * as React from "react"
import type { IconProps } from "../types"
const CircleQuarterSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <g clipPath="url(#a)">
          <circle
            cx={7.5}
            cy={7.5}
            r={6.443}
            stroke={color}
            strokeWidth={1.333}
          />
          <path fill={color} d="M11.944 7.5A4.444 4.444 0 0 0 7.5 3.056V7.5z" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
CircleQuarterSolid.displayName = "CircleQuarterSolid"
export default CircleQuarterSolid

import * as React from "react"
import type { IconProps } from "../types"
const SquareBlueSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <rect width={8} height={8} x={3.5} y={3.5} fill="#60A5FA" rx={2} />
        <rect
          width={7}
          height={7}
          x={4}
          y={4}
          stroke={color}
          strokeOpacity={0.12}
          rx={1.5}
        />
      </svg>
    )
  }
)
SquareBlueSolid.displayName = "SquareBlueSolid"
export default SquareBlueSolid
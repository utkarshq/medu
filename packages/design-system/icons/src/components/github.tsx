import * as React from "react"
import type { IconProps } from "../types"
const Github = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill="#1B1F23"
          fillRule="evenodd"
          d="M7.5.917C3.77.917.75 3.937.75 7.667a6.75 6.75 0 0 0 4.615 6.404c.338.059.464-.144.464-.321 0-.16-.008-.692-.008-1.257-1.696.312-2.135-.414-2.27-.793-.076-.194-.405-.793-.692-.954-.236-.126-.573-.439-.008-.447.531-.008.911.49 1.038.692.607 1.02 1.578.734 1.966.557.059-.439.236-.734.43-.903-1.502-.169-3.071-.751-3.071-3.333 0-.734.261-1.341.692-1.814-.068-.169-.304-.86.067-1.789 0 0 .565-.177 1.856.692a6.3 6.3 0 0 1 1.688-.228c.574 0 1.147.076 1.687.228 1.291-.877 1.857-.692 1.857-.692.37.928.135 1.62.067 1.79.43.472.692 1.07.692 1.813 0 2.59-1.578 3.164-3.08 3.333.245.21.456.616.456 1.249 0 .902-.008 1.628-.008 1.856 0 .177.126.388.464.32a6.76 6.76 0 0 0 4.598-6.403c0-3.73-3.02-6.75-6.75-6.75"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
Github.displayName = "Github"
export default Github

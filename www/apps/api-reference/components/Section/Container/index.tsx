import clsx from "clsx"
import SectionDivider from "../Divider"
import { forwardRef } from "react"

type SectionContainerProps = {
  children: React.ReactNode
  noTopPadding?: boolean
  noDivider?: boolean
}

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  function SectionContainer(
    { children, noTopPadding = false, noDivider = false },
    ref
  ) {
    return (
      <div
        className={clsx("relative pb-4 md:pb-7", !noTopPadding && "pt-7")}
        ref={ref}
      >
        {children}
        {!noDivider && (
          <SectionDivider className="-left-[16px] lg:!-left-1/4" />
        )}
      </div>
    )
  }
)

export default SectionContainer

"use client"

// @refresh reset

import React, { useEffect, useMemo, useRef } from "react"
import { SidebarItemSubCategory as SidebarItemSubCategoryType } from "types"
import {
  checkSidebarItemVisibility,
  SidebarItem,
  useMobile,
  useSidebar,
} from "../../../.."
import clsx from "clsx"

export type SidebarItemLinkProps = {
  item: SidebarItemSubCategoryType
  nested?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

export const SidebarItemSubCategory = ({
  item,
  className,
  nested = false,
}: SidebarItemLinkProps) => {
  const { isLinkActive, disableActiveTransition, sidebarRef } = useSidebar()
  const { isMobile } = useMobile()
  const active = useMemo(
    () => !isMobile && isLinkActive(item, true),
    [isLinkActive, item, isMobile]
  )
  const ref = useRef<HTMLLIElement>(null)

  /**
   * Tries to place the item in the center of the sidebar
   */
  const newTopCalculator = (): number => {
    if (!sidebarRef.current || !ref.current) {
      return 0
    }
    const sidebarBoundingRect = sidebarRef.current.getBoundingClientRect()
    const sidebarHalf = sidebarBoundingRect.height / 2
    const itemTop = ref.current.offsetTop
    const itemBottom =
      itemTop + (ref.current.children.item(0) as HTMLElement)?.clientHeight

    // try deducting half
    let newTop = itemTop - sidebarHalf
    let newBottom = newTop + sidebarBoundingRect.height
    if (newTop <= itemTop && newBottom >= itemBottom) {
      return newTop
    }

    // try adding half
    newTop = itemTop + sidebarHalf
    newBottom = newTop + sidebarBoundingRect.height
    if (newTop <= itemTop && newBottom >= itemBottom) {
      return newTop
    }

    //return the item's top minus some top margin
    return itemTop - sidebarBoundingRect.top
  }

  useEffect(() => {
    if (
      active &&
      ref.current &&
      sidebarRef.current &&
      window.innerWidth >= 1025
    ) {
      if (
        !disableActiveTransition &&
        !checkSidebarItemVisibility(
          (ref.current.children.item(0) as HTMLElement) || ref.current,
          !disableActiveTransition
        )
      ) {
        ref.current.scrollIntoView({
          block: "center",
        })
      } else if (disableActiveTransition) {
        sidebarRef.current.scrollTo({
          top: newTopCalculator(),
        })
      }
    }
  }, [active, sidebarRef.current, disableActiveTransition])

  const hasChildren = useMemo(() => {
    return item.children?.length || 0 > 0
  }, [item.children])

  const isTitleOneWord = useMemo(
    () => item.title.split(" ").length === 1,
    [item.title]
  )

  return (
    <li ref={ref}>
      <span className="block px-docs_0.75">
        <span
          className={clsx(
            "py-docs_0.25 px-docs_0.5",
            "block w-full",
            !isTitleOneWord && "break-words",
            active && [
              "rounded-docs_sm",
              "shadow-borders-base dark:shadow-borders-base-dark",
              "text-medusa-fg-base",
            ],
            !active && [
              !nested && "text-medusa-fg-subtle",
              nested && "text-medusa-fg-muted",
            ],
            "text-compact-small-plus",
            className
          )}
        >
          <span
            className={clsx(
              isTitleOneWord && "truncate",
              nested && "pl-docs_1.5"
            )}
          >
            {item.title}
          </span>
          {item.additionalElms}
        </span>
      </span>
      {hasChildren && (
        <ul
          className={clsx(
            "ease-ease overflow-hidden",
            "flex flex-col gap-docs_0.125",
            "pb-docs_0.5 pt-docs_0.125"
          )}
        >
          {item.children!.map((childItem, index) => (
            <SidebarItem
              item={childItem}
              key={index}
              nested={!item.childrenSameLevel}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

"use client"

import React, { Children, useCallback, useEffect, useMemo, useRef } from "react"
import {
  Badge,
  BaseTabType,
  CodeBlockProps,
  CodeBlockStyle,
  useColorMode,
  useTabs,
} from "../.."
import clsx from "clsx"
import { CodeBlockActions, CodeBlockActionsProps } from "../CodeBlock/Actions"
import { CodeBlockHeaderWrapper } from "../CodeBlock/Header/Wrapper"

type CodeTab = BaseTabType & {
  codeProps: CodeBlockProps
  codeBlock: React.ReactNode
  children?: React.ReactNode
}

type CodeTabProps = {
  children: React.ReactNode
  className?: string
  group?: string
  title?: string
  blockStyle?: CodeBlockStyle
}

export const CodeTabs = ({
  children,
  className,
  group = "client",
  blockStyle = "loud",
}: CodeTabProps) => {
  const { colorMode } = useColorMode()

  const isCodeBlock = (
    node: React.ReactNode
  ): node is
    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
    | React.ReactPortal => {
    if (!React.isValidElement(node)) {
      return false
    }

    if (node.type === "pre") {
      return true
    }

    const typedProps = node.props as Record<string, unknown>

    return "source" in typedProps
  }

  const getCodeBlockProps = (
    codeBlock: React.ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    >
  ): CodeBlockProps | undefined => {
    if (typeof codeBlock.props !== "object" || !codeBlock.props) {
      return undefined
    }

    if ("source" in codeBlock.props) {
      return codeBlock.props as CodeBlockProps
    }

    if (
      "children" in codeBlock.props &&
      typeof codeBlock.props.children === "object" &&
      codeBlock.props.children
    ) {
      return getCodeBlockProps(
        codeBlock.props.children as React.ReactElement<
          unknown,
          string | React.JSXElementConstructor<any>
        >
      )
    }

    return undefined
  }

  const tabs: CodeTab[] = useMemo(() => {
    const tempTabs: CodeTab[] = []
    Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return
      }
      const typedChildProps = child.props as CodeTab
      if (
        !React.isValidElement(child) ||
        !typedChildProps.label ||
        !typedChildProps.value ||
        !React.isValidElement(typedChildProps.children)
      ) {
        return
      }

      const codeBlock: React.ReactNode = isCodeBlock(typedChildProps.children)
        ? typedChildProps.children
        : undefined

      if (!codeBlock) {
        return
      }

      let codeBlockProps = codeBlock.props as CodeBlockProps

      const commonProps = {
        badgeLabel: undefined,
        hasTabs: true,
        className: clsx("!my-0", codeBlockProps.className),
      }

      if (
        typeof codeBlock.type !== "string" &&
        "name" in codeBlock.type &&
        codeBlock.type.name === "CodeBlock"
      ) {
        codeBlockProps = {
          ...codeBlockProps,
          ...commonProps,
        }
      }

      const modifiedProps: CodeBlockProps = {
        ...(getCodeBlockProps(codeBlock) || {
          source: "",
        }),
        ...commonProps,
      }

      tempTabs.push({
        label: typedChildProps.label,
        value: typedChildProps.value,
        codeProps: modifiedProps,
        codeBlock: {
          ...codeBlock,
          props: {
            ...codeBlockProps,
            children: {
              ...(typeof codeBlockProps.children === "object"
                ? codeBlockProps.children
                : {}),
              props: modifiedProps,
            },
          },
        },
      })
    })

    return tempTabs
  }, [children])

  const { selectedTab, changeSelectedTab } = useTabs<CodeTab>({
    tabs,
    group,
  })

  const tabRefs: (HTMLButtonElement | null)[] = useMemo(() => [], [])
  const codeTabSelectorRef = useRef<HTMLSpanElement | null>(null)
  const codeTabsWrapperRef = useRef<HTMLDivElement | null>(null)

  const bgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "bg-medusa-contrast-bg-base",
        blockStyle === "subtle" && [
          colorMode === "light" && "bg-medusa-bg-component",
          colorMode === "dark" && "bg-medusa-code-bg-header",
        ]
      ),
    [blockStyle, colorMode]
  )

  const boxShadow = useMemo(
    () =>
      clsx(
        blockStyle === "loud" &&
          "shadow-elevation-code-block dark:shadow-elevation-code-block-dark",
        blockStyle === "subtle" && "shadow-none"
      ),
    [blockStyle]
  )

  const changeTabSelectorCoordinates = useCallback(
    (selectedTabElm: HTMLElement) => {
      if (!codeTabSelectorRef?.current || !codeTabsWrapperRef?.current) {
        return
      }
      const selectedTabsCoordinates = selectedTabElm.getBoundingClientRect()
      const tabsWrapperCoordinates =
        codeTabsWrapperRef.current.getBoundingClientRect()
      codeTabSelectorRef.current.style.left = `${
        selectedTabsCoordinates.left - tabsWrapperCoordinates.left
      }px`
      codeTabSelectorRef.current.style.width = `${selectedTabsCoordinates.width}px`
      if (blockStyle !== "loud") {
        codeTabSelectorRef.current.style.height = `${selectedTabsCoordinates.height}px`
      }
    },
    [blockStyle]
  )

  useEffect(() => {
    if (codeTabSelectorRef?.current && tabRefs.length) {
      const selectedTabElm = tabRefs.find(
        (tab) => tab?.getAttribute("aria-selected") === "true"
      )
      if (selectedTabElm) {
        changeTabSelectorCoordinates(
          selectedTabElm.parentElement || selectedTabElm
        )
      }
    }
  }, [codeTabSelectorRef, tabRefs, changeTabSelectorCoordinates, selectedTab])

  const actionsProps: CodeBlockActionsProps | undefined = useMemo(() => {
    if (!selectedTab) {
      return
    }

    return {
      source: selectedTab?.codeProps.source,
      blockStyle,
      noReport: selectedTab?.codeProps.noReport,
      noCopy: selectedTab?.codeProps.noCopy,
      inInnerCode: true,
      showGradientBg: false,
      inHeader: true,
      isCollapsed: false,
    }
  }, [selectedTab])

  return (
    <div
      className={clsx(
        "my-docs_1 w-full max-w-full",
        "rounded-docs_lg",
        bgColor,
        boxShadow,
        className
      )}
    >
      <CodeBlockHeaderWrapper blockStyle={blockStyle} ref={codeTabsWrapperRef}>
        <span
          className={clsx(
            "xs:absolute xs:transition-all xs:duration-200 xs:ease-ease xs:bottom-0",
            blockStyle === "loud" && "bg-medusa-contrast-fg-primary h-px",
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "xs:border-medusa-border-base xs:bg-medusa-bg-base",
              colorMode === "dark" &&
                "xs:border-medusa-code-border xs:bg-medusa-code-bg-base",
            ]
          )}
          ref={codeTabSelectorRef}
        ></span>
        <ul
          className={clsx(
            "!list-none flex gap-docs_0.75 items-center",
            "p-0 mb-0"
          )}
        >
          {Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) {
              return <></>
            }

            return (
              <child.type
                {...(typeof child.props === "object" ? child.props : {})}
                changeSelectedTab={changeSelectedTab}
                pushRef={(tabButton: HTMLButtonElement | null) =>
                  tabRefs.push(tabButton)
                }
                blockStyle={blockStyle}
                isSelected={
                  !selectedTab
                    ? index === 0
                    : selectedTab.value === (child.props as CodeTab).value
                }
              />
            )
          })}
        </ul>
        {selectedTab?.codeProps.badgeLabel && (
          <Badge variant={selectedTab?.codeProps.badgeColor || "code"}>
            {selectedTab.codeProps.badgeLabel}
          </Badge>
        )}
        {actionsProps && <CodeBlockActions {...actionsProps} />}
      </CodeBlockHeaderWrapper>
      {selectedTab?.codeBlock}
    </div>
  )
}

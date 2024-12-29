import { c as createCollection, a as createContextScope, r as reactExports, j as jsxRuntimeExports, u as useComposedRefs, b as useDirection, d as useControllableState, e as useCallbackRef, P as Primitive, f as composeEventHandlers, g as useId, h as createContextScope$1, i as createPopperScope, A as Anchor, k as Presence, l as hideOthers, m as useFocusGuards, F as FocusScope, D as DismissableLayer, C as Content, n as Arrow, o as composeRefs, R as ReactRemoveScroll, S as Slot, p as dispatchDiscreteCustomEvent, q as Root2$1, s as Portal$1, t as cn, v as ChevronRightIcon, w as CheckIcon, x as DotFilledIcon, y as useAlgorithmsVisibility, z as useDragAlgorithm, B as DRAG_CONTAINER_LAYOUT, E as DRAG_ITEM_TYPE, G as useTranslation, H as CHART_ACTION, I as useGlobalChartsInfo, J as useChartInfo, K as visualizeChartDataFields, L as ChartInfoProvider, M as Button, X, N as SORTING_ALGORITHM, O as createLazyFileRoute, Q as h, T as v } from "./index-cIUzcl2x.js";
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME$2 = "RovingFocusGroup";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(GROUP_NAME$2);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME$2,
  [createCollectionScope$1]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$2);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME$2;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId = null, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId,
    onChange: onCurrentTabStopIdChange
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection$1(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst$1(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME$2 = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME$2, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection$1(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection$1.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray$1(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst$1(candidateNodes));
              }
            })
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME$2;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst$1(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray$1(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root$1 = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var SELECTION_KEYS = ["Enter", " "];
var FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
var LAST_KEYS = ["ArrowUp", "PageDown", "End"];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection, useCollection, createCollectionScope] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope$1(MENU_NAME, [
  createCollectionScope,
  createPopperScope,
  createRovingFocusGroupScope
]);
var usePopperScope = createPopperScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = (props) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
  const popperScope = usePopperScope(__scopeMenu);
  const [content, setContent] = reactExports.useState(null);
  const isUsingKeyboardRef = reactExports.useRef(false);
  const handleOpenChange = useCallbackRef(onOpenChange);
  const direction = useDirection(dir);
  reactExports.useEffect(() => {
    const handleKeyDown = () => {
      isUsingKeyboardRef.current = true;
      document.addEventListener("pointerdown", handlePointer, { capture: true, once: true });
      document.addEventListener("pointermove", handlePointer, { capture: true, once: true });
    };
    const handlePointer = () => isUsingKeyboardRef.current = false;
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("pointerdown", handlePointer, { capture: true });
      document.removeEventListener("pointermove", handlePointer, { capture: true });
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuProvider,
    {
      scope: __scopeMenu,
      open,
      onOpenChange: handleOpenChange,
      content,
      onContentChange: setContent,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuRootProvider,
        {
          scope: __scopeMenu,
          onClose: reactExports.useCallback(() => handleOpenChange(false), [handleOpenChange]),
          isUsingKeyboardRef,
          dir: direction,
          modal,
          children
        }
      )
    }
  ) });
};
Menu.displayName = MENU_NAME;
var ANCHOR_NAME = "MenuAnchor";
var MenuAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
MenuAnchor.displayName = ANCHOR_NAME;
var PORTAL_NAME$1 = "MenuPortal";
var [PortalProvider, usePortalContext] = createMenuContext(PORTAL_NAME$1, {
  forceMount: void 0
});
var MenuPortal = (props) => {
  const { __scopeMenu, forceMount, children, container } = props;
  const context = useMenuContext(PORTAL_NAME$1, __scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeMenu, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
MenuPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$1);
var MenuContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
  }
);
var MenuRootContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    reactExports.useEffect(() => {
      const content = ref.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        disableOutsideScroll: true,
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        ),
        onDismiss: () => context.onOpenChange(false)
      }
    );
  }
);
var MenuRootContentNonModal = reactExports.forwardRef((props, forwardedRef) => {
  const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuContentImpl,
    {
      ...props,
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      disableOutsideScroll: false,
      onDismiss: () => context.onOpenChange(false)
    }
  );
});
var MenuContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      ...contentProps
    } = props;
    const context = useMenuContext(CONTENT_NAME$1, __scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const getItems = useCollection(__scopeMenu);
    const [currentItemId, setCurrentItemId] = reactExports.useState(null);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = reactExports.useRef(0);
    const searchRef = reactExports.useRef("");
    const pointerGraceTimerRef = reactExports.useRef(0);
    const pointerGraceIntentRef = reactExports.useRef(null);
    const pointerDirRef = reactExports.useRef("right");
    const lastPointerXRef = reactExports.useRef(0);
    const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : reactExports.Fragment;
    const scrollLockWrapperProps = disableOutsideScroll ? { as: Slot, allowPinchZoom: true } : void 0;
    const handleTypeaheadSearch = (key) => {
      const search = searchRef.current + key;
      const items = getItems().filter((item) => !item.disabled);
      const currentItem = document.activeElement;
      const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
      const values = items.map((item) => item.textValue);
      const nextMatch = getNextMatch(values, search, currentMatch);
      const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
      if (newItem) {
        setTimeout(() => newItem.focus());
      }
    };
    reactExports.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    useFocusGuards();
    const isPointerMovingToSubmenu = reactExports.useCallback((event) => {
      const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentProvider,
      {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        onItemLeave: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) return;
            contentRef.current?.focus();
            setCurrentItemId(null);
          },
          [isPointerMovingToSubmenu]
        ),
        onTriggerLeave: reactExports.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: reactExports.useCallback((intent) => {
          pointerGraceIntentRef.current = intent;
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollLockWrapper, { ...scrollLockWrapperProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: trapFocus,
            onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
              event.preventDefault();
              contentRef.current?.focus({ preventScroll: true });
            }),
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside,
                onInteractOutside,
                onDismiss,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Root$1,
                  {
                    asChild: true,
                    ...rovingFocusGroupScope,
                    dir: rootContext.dir,
                    orientation: "vertical",
                    loop,
                    currentTabStopId: currentItemId,
                    onCurrentTabStopIdChange: setCurrentItemId,
                    onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
                      if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                    }),
                    preventScrollOnEntryFocus: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Content,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": getOpenState(context.open),
                        "data-radix-menu-content": "",
                        dir: rootContext.dir,
                        ...popperScope,
                        ...contentProps,
                        ref: composedRefs,
                        style: { outline: "none", ...contentProps.style },
                        onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                          const target = event.target;
                          const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                          const isCharacterKey = event.key.length === 1;
                          if (isKeyDownInside) {
                            if (event.key === "Tab") event.preventDefault();
                            if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                          }
                          const content = contentRef.current;
                          if (event.target !== content) return;
                          if (!FIRST_LAST_KEYS.includes(event.key)) return;
                          event.preventDefault();
                          const items = getItems().filter((item) => !item.disabled);
                          const candidateNodes = items.map((item) => item.ref.current);
                          if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                          focusFirst(candidateNodes);
                        }),
                        onBlur: composeEventHandlers(props.onBlur, (event) => {
                          if (!event.currentTarget.contains(event.target)) {
                            window.clearTimeout(timerRef.current);
                            searchRef.current = "";
                          }
                        }),
                        onPointerMove: composeEventHandlers(
                          props.onPointerMove,
                          whenMouse((event) => {
                            const target = event.target;
                            const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                            if (event.currentTarget.contains(target) && pointerXHasChanged) {
                              const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                              pointerDirRef.current = newDir;
                              lastPointerXRef.current = event.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
MenuContent.displayName = CONTENT_NAME$1;
var GROUP_NAME$1 = "MenuGroup";
var MenuGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", ...groupProps, ref: forwardedRef });
  }
);
MenuGroup.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "MenuLabel";
var MenuLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...labelProps, ref: forwardedRef });
  }
);
MenuLabel.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = reactExports.useRef(null);
    const rootContext = useMenuRootContext(ITEM_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME$1, props.__scopeMenu);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const isPointerDownRef = reactExports.useRef(false);
    const handleSelect = () => {
      const menuItem = ref.current;
      if (!disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true });
        menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
        dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
        if (itemSelectEvent.defaultPrevented) {
          isPointerDownRef.current = false;
        } else {
          rootContext.onClose();
        }
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        ...itemProps,
        ref: composedRefs,
        disabled,
        onClick: composeEventHandlers(props.onClick, handleSelect),
        onPointerDown: (event) => {
          props.onPointerDown?.(event);
          isPointerDownRef.current = true;
        },
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          if (!isPointerDownRef.current) event.currentTarget?.click();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (disabled || isTypingAhead && event.key === " ") return;
          if (SELECTION_KEYS.includes(event.key)) {
            event.currentTarget.click();
            event.preventDefault();
          }
        })
      }
    );
  }
);
MenuItem.displayName = ITEM_NAME$1;
var MenuItemImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME$1, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const [textContent, setTextContent] = reactExports.useState("");
    reactExports.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? "").trim());
      }
    }, [itemProps.children]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeMenu,
        disabled,
        textValue: textValue ?? textContent,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { asChild: true, ...rovingFocusGroupScope, focusable: !disabled, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "menuitem",
            "data-highlighted": isFocused ? "" : void 0,
            "aria-disabled": disabled || void 0,
            "data-disabled": disabled ? "" : void 0,
            ...itemProps,
            ref: composedRefs,
            onPointerMove: composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event);
                } else {
                  contentContext.onItemEnter(event);
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget;
                    item.focus({ preventScroll: true });
                  }
                }
              })
            ),
            onPointerLeave: composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event))
            ),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    );
  }
);
var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
var MenuCheckboxItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemcheckbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        ...checkboxItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(
  RADIO_GROUP_NAME$1,
  { value: void 0, onValueChange: () => {
  } }
);
var MenuRadioGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { ...groupProps, ref: forwardedRef }) });
  }
);
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { value, ...radioItemProps } = props;
    const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
    const checked = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemradio",
        "aria-checked": checked,
        ...radioItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          radioItemProps.onSelect,
          () => context.onValueChange?.(value),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
var ITEM_INDICATOR_NAME = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(
  ITEM_INDICATOR_NAME,
  { checked: false }
);
var MenuItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            ...itemIndicatorProps,
            ref: forwardedRef,
            "data-state": getCheckedState(indicatorContext.checked)
          }
        )
      }
    );
  }
);
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SEPARATOR_NAME$1 = "MenuSeparator";
var MenuSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...separatorProps,
        ref: forwardedRef
      }
    );
  }
);
MenuSeparator.displayName = SEPARATOR_NAME$1;
var ARROW_NAME$1 = "MenuArrow";
var MenuArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
MenuArrow.displayName = ARROW_NAME$1;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
var MenuSubTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const openTimerRef = reactExports.useRef(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = { __scopeMenu: props.__scopeMenu };
    const clearOpenTimer = reactExports.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);
    reactExports.useEffect(() => clearOpenTimer, [clearOpenTimer]);
    reactExports.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current;
      return () => {
        window.clearTimeout(pointerGraceTimer);
        onPointerGraceIntentChange(null);
      };
    }, [pointerGraceTimerRef, onPointerGraceIntentChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuAnchor, { asChild: true, ...scope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        id: subContext.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": subContext.contentId,
        "data-state": getOpenState(context.open),
        ...props,
        ref: composeRefs(forwardedRef, subContext.onTriggerChange),
        onClick: (event) => {
          props.onClick?.(event);
          if (props.disabled || event.defaultPrevented) return;
          event.currentTarget.focus();
          if (!context.open) context.onOpenChange(true);
        },
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse((event) => {
            contentContext.onItemEnter(event);
            if (event.defaultPrevented) return;
            if (!props.disabled && !context.open && !openTimerRef.current) {
              contentContext.onPointerGraceIntentChange(null);
              openTimerRef.current = window.setTimeout(() => {
                context.onOpenChange(true);
                clearOpenTimer();
              }, 100);
            }
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse((event) => {
            clearOpenTimer();
            const contentRect = context.content?.getBoundingClientRect();
            if (contentRect) {
              const side = context.content?.dataset.side;
              const rightSide = side === "right";
              const bleed = rightSide ? -5 : 5;
              const contentNearEdge = contentRect[rightSide ? "left" : "right"];
              const contentFarEdge = contentRect[rightSide ? "right" : "left"];
              contentContext.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: event.clientX + bleed, y: event.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom }
                ],
                side
              });
              window.clearTimeout(pointerGraceTimerRef.current);
              pointerGraceTimerRef.current = window.setTimeout(
                () => contentContext.onPointerGraceIntentChange(null),
                300
              );
            } else {
              contentContext.onTriggerLeave(event);
              if (event.defaultPrevented) return;
              contentContext.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (props.disabled || isTypingAhead && event.key === " ") return;
          if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
            context.onOpenChange(true);
            context.content?.focus();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
var SUB_CONTENT_NAME$1 = "MenuSubContent";
var MenuSubContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        id: subContext.contentId,
        "aria-labelledby": subContext.triggerId,
        ...subContentProps,
        ref: composedRefs,
        align: "start",
        side: rootContext.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        trapFocus: false,
        onOpenAutoFocus: (event) => {
          if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
          event.preventDefault();
        },
        onCloseAutoFocus: (event) => event.preventDefault(),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          if (event.target !== subContext.trigger) context.onOpenChange(false);
        }),
        onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
          rootContext.onClose();
          event.preventDefault();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isKeyDownInside = event.currentTarget.contains(event.target);
          const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
          if (isKeyDownInside && isCloseKey) {
            context.onOpenChange(false);
            subContext.trigger?.focus();
            event.preventDefault();
          }
        })
      }
    ) }) }) });
  }
);
MenuSubContent.displayName = SUB_CONTENT_NAME$1;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getCheckedState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst(candidates) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v2) => v2 !== currentMatch);
  const nextMatch = wrappedValues.find(
    (value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function isPointerInGraceArea(event, area) {
  if (!area) return false;
  const cursorPos = { x: event.clientX, y: event.clientY };
  return isPointInPolygon(cursorPos, area);
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root3 = Menu;
var Anchor2 = MenuAnchor;
var Portal = MenuPortal;
var Content2$1 = MenuContent;
var Group = MenuGroup;
var Label = MenuLabel;
var Item2$1 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator = MenuItemIndicator;
var Separator = MenuSeparator;
var Arrow2 = MenuArrow;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;
var CONTEXT_MENU_NAME = "ContextMenu";
var [createContextMenuContext, createContextMenuScope] = createContextScope$1(CONTEXT_MENU_NAME, [
  createMenuScope
]);
var useMenuScope = createMenuScope();
var [ContextMenuProvider, useContextMenuContext] = createContextMenuContext(CONTEXT_MENU_NAME);
var ContextMenu$1 = (props) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props;
  const [open, setOpen] = reactExports.useState(false);
  const menuScope = useMenuScope(__scopeContextMenu);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);
  const handleOpenChange = reactExports.useCallback(
    (open2) => {
      setOpen(open2);
      handleOpenChangeProp(open2);
    },
    [handleOpenChangeProp]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ContextMenuProvider,
    {
      scope: __scopeContextMenu,
      open,
      onOpenChange: handleOpenChange,
      modal,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Root3,
        {
          ...menuScope,
          dir,
          open,
          onOpenChange: handleOpenChange,
          modal,
          children
        }
      )
    }
  );
};
ContextMenu$1.displayName = CONTEXT_MENU_NAME;
var TRIGGER_NAME = "ContextMenuTrigger";
var ContextMenuTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, disabled = false, ...triggerProps } = props;
    const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const pointRef = reactExports.useRef({ x: 0, y: 0 });
    const virtualRef = reactExports.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current })
    });
    const longPressTimerRef = reactExports.useRef(0);
    const clearLongPress = reactExports.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      []
    );
    const handleOpen = (event) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      context.onOpenChange(true);
    };
    reactExports.useEffect(() => clearLongPress, [clearLongPress]);
    reactExports.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor2, { ...menuScope, virtualRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.span,
        {
          "data-state": context.open ? "open" : "closed",
          "data-disabled": disabled ? "" : void 0,
          ...triggerProps,
          ref: forwardedRef,
          style: { WebkitTouchCallout: "none", ...props.style },
          onContextMenu: disabled ? props.onContextMenu : composeEventHandlers(props.onContextMenu, (event) => {
            clearLongPress();
            handleOpen(event);
            event.preventDefault();
          }),
          onPointerDown: disabled ? props.onPointerDown : composeEventHandlers(
            props.onPointerDown,
            whenTouchOrPen((event) => {
              clearLongPress();
              longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
            })
          ),
          onPointerMove: disabled ? props.onPointerMove : composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress)),
          onPointerCancel: disabled ? props.onPointerCancel : composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress)),
          onPointerUp: disabled ? props.onPointerUp : composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
        }
      )
    ] });
  }
);
ContextMenuTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "ContextMenuPortal";
var ContextMenuPortal = (props) => {
  const { __scopeContextMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...menuScope, ...portalProps });
};
ContextMenuPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "ContextMenuContent";
var ContextMenuContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...contentProps } = props;
    const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2$1,
      {
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        side: "right",
        sideOffset: 2,
        align: "start",
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented && !context.modal) hasInteractedOutsideRef.current = true;
        },
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
ContextMenuContent$1.displayName = CONTENT_NAME;
var GROUP_NAME = "ContextMenuGroup";
var ContextMenuGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
ContextMenuGroup$1.displayName = GROUP_NAME;
var LABEL_NAME = "ContextMenuLabel";
var ContextMenuLabel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
ContextMenuLabel$1.displayName = LABEL_NAME;
var ITEM_NAME = "ContextMenuItem";
var ContextMenuItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Item2$1, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
ContextMenuItem$1.displayName = ITEM_NAME;
var CHECKBOX_ITEM_NAME = "ContextMenuCheckboxItem";
var ContextMenuCheckboxItem$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
});
ContextMenuCheckboxItem$1.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "ContextMenuRadioGroup";
var ContextMenuRadioGroup = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
});
ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "ContextMenuRadioItem";
var ContextMenuRadioItem$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
});
ContextMenuRadioItem$1.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME$1 = "ContextMenuItemIndicator";
var ContextMenuItemIndicator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
ContextMenuItemIndicator.displayName = INDICATOR_NAME$1;
var SEPARATOR_NAME = "ContextMenuSeparator";
var ContextMenuSeparator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
});
ContextMenuSeparator$1.displayName = SEPARATOR_NAME;
var ARROW_NAME = "ContextMenuArrow";
var ContextMenuArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
ContextMenuArrow.displayName = ARROW_NAME;
var SUB_TRIGGER_NAME = "ContextMenuSubTrigger";
var ContextMenuSubTrigger$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...triggerItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SubTrigger, { ...menuScope, ...triggerItemProps, ref: forwardedRef });
});
ContextMenuSubTrigger$1.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "ContextMenuSubContent";
var ContextMenuSubContent$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeContextMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SubContent,
    {
      ...menuScope,
      ...subContentProps,
      ref: forwardedRef,
      style: {
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
ContextMenuSubContent$1.displayName = SUB_CONTENT_NAME;
function whenTouchOrPen(handler) {
  return (event) => event.pointerType !== "mouse" ? handler(event) : void 0;
}
var Root2 = ContextMenu$1;
var Trigger = ContextMenuTrigger$1;
var Portal2 = ContextMenuPortal;
var Content2 = ContextMenuContent$1;
var Group2 = ContextMenuGroup$1;
var Label2 = ContextMenuLabel$1;
var Item2 = ContextMenuItem$1;
var CheckboxItem2 = ContextMenuCheckboxItem$1;
var RadioItem2 = ContextMenuRadioItem$1;
var ItemIndicator2 = ContextMenuItemIndicator;
var Separator2 = ContextMenuSeparator$1;
var SubTrigger2 = ContextMenuSubTrigger$1;
var SubContent2 = ContextMenuSubContent$1;
const ContextMenu = Root2;
const ContextMenuTrigger = Trigger;
const ContextMenuGroup = Group2;
const ContextMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRightIcon, { className: "ml-auto h-4 w-4" })
    ]
  }
));
ContextMenuSubTrigger.displayName = SubTrigger2.displayName;
const ContextMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
ContextMenuSubContent.displayName = SubContent2.displayName;
const ContextMenuContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
ContextMenuContent.displayName = Content2.displayName;
const ContextMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
ContextMenuItem.displayName = Item2.displayName;
const ContextMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
ContextMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const ContextMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DotFilledIcon, { className: "h-4 w-4 fill-current" }) }) }),
      children
    ]
  }
));
ContextMenuRadioItem.displayName = RadioItem2.displayName;
const ContextMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
ContextMenuLabel.displayName = Label2.displayName;
const ContextMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-border", className),
    ...props
  }
));
ContextMenuSeparator.displayName = Separator2.displayName;
function AlgorithmContextMenuCheckboxItem({
  algorithm,
  visible,
  flippedProps
}) {
  const { setAlgorithmsVisibility } = useAlgorithmsVisibility();
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CONTEXT_ITEM,
    algorithm,
    DRAG_CONTAINER_LAYOUT.VERTICAL
  );
  const { t } = useTranslation("AlgorithmsNames");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ContextMenuCheckboxItem,
    {
      className: `${isDragging ? "opacity-50" : "opacity-100"}`,
      ref,
      "data-handler-id": handlerId,
      checked: visible,
      onClick: (e) => {
        e.preventDefault();
        setAlgorithmsVisibility(algorithm, !visible);
      },
      ...flippedProps,
      children: t(algorithm)
    }
  );
}
function getDefaultColor(action) {
  return action === CHART_ACTION.FINISHED ? "hsl(var(--chart-finish))" : "hsl(var(--chart-default))";
}
function getFirstColor(action) {
  return action === CHART_ACTION.ANIMATE_SWAP || action === CHART_ACTION.ANIMATE_REPLACE ? "hsl(var(--chart-swap))" : "hsl(var(--chart-compare-first))";
}
function getSecondColor(action, defaultColor) {
  if (action === CHART_ACTION.ANIMATE_SWAP) {
    return "hsl(var(--chart-swap))";
  }
  if (action === CHART_ACTION.ANIMATE_REPLACE) {
    return defaultColor;
  }
  return "hsl(var(--chart-compare-second))";
}
function getFirstTransform(action, firstKey, secondKey, firstNumber, secondNumber, fields) {
  if (action === CHART_ACTION.ANIMATE_SWAP) {
    return `translateX(${Math.abs(firstKey - secondKey) / fields.length * 100}%)`;
  }
  if (action === CHART_ACTION.ANIMATE_REPLACE) {
    return `scaleY(${1 / (fields[firstNumber].number / secondNumber)})`;
  }
  return "translateX(0%) scaleY(1)";
}
function getSecondTransform(action, firstKey, secondKey, fields) {
  return action === CHART_ACTION.ANIMATE_SWAP ? `translateX(${-Math.abs(firstKey - secondKey) / fields.length * 100}%)` : "translateX(0%) scaleY(1)";
}
function getColorMappingFunction(action, firstKey, secondKey) {
  const defaultColor = getDefaultColor(action);
  const firstKeyColor = getFirstColor(action);
  const secondKeyColor = getSecondColor(action, defaultColor);
  return (key) => {
    if (key === firstKey) {
      return firstKeyColor;
    }
    if (key === secondKey) {
      return secondKeyColor;
    }
    return defaultColor;
  };
}
function getTransformMappingFunction(action, firstKey, secondKey, firstNumber, secondNumber, fields) {
  const firstKeyTransform = getFirstTransform(
    action,
    firstKey,
    secondKey,
    firstNumber,
    secondNumber,
    fields
  );
  const secondKeyTransform = getSecondTransform(
    action,
    firstKey,
    secondKey,
    fields
  );
  if (action === CHART_ACTION.ANIMATE_SWAP || action === CHART_ACTION.ANIMATE_REPLACE) {
    return (key) => {
      if (key === firstKey) {
        return firstKeyTransform;
      }
      if (key === secondKey) {
        return secondKeyTransform;
      }
      return "translateX(0%) scaleY(1)";
    };
  }
  return () => "translateX(0%) scaleY(1)";
}
function getTransitionPropertyMappingFunction(isForward, action, firstKey, secondKey) {
  if (!isForward) {
    return () => "none";
  }
  if (action === CHART_ACTION.ANIMATE_REPLACE) {
    return (key) => {
      if (key === firstKey || key === secondKey) {
        return "transform";
      }
      return "none";
    };
  }
  if (action === CHART_ACTION.ANIMATE_SWAP) {
    return (key) => {
      if (key === firstKey) {
        return "transform";
      }
      return "none";
    };
  }
  return () => "none";
}
function ChartBarChart({ chartDataState }) {
  const { defaultChartDataState, directionForwardRef, durationRef } = useGlobalChartsInfo();
  const [bars, setBars] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const { fields, visualization } = chartDataState;
    const { numbers, action } = visualization;
    const firstNumber = numbers?.[0];
    const secondNumber = numbers?.[1];
    const firstKey = fields?.[firstNumber]?.key;
    const secondKey = fields?.[secondNumber]?.key;
    const width = 600;
    const height = 400;
    const barWidth = width / chartDataState.fields.length;
    const maxNumber = Math.max(
      ...defaultChartDataState.fields.map((field) => field.number)
    );
    const xScale = (key) => key / chartDataState.fields.length * width;
    const yScale = (number) => height - number / maxNumber * height;
    const colorMapping = getColorMappingFunction(action, firstKey, secondKey);
    const transformMapping = getTransformMappingFunction(
      action,
      firstKey,
      secondKey,
      firstNumber,
      secondNumber,
      fields
    );
    const transitionPropertyMapping = getTransitionPropertyMappingFunction(
      directionForwardRef.current,
      action,
      firstKey,
      secondKey
    );
    const newBars = chartDataState.fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "rect",
      {
        className: "bar",
        x: xScale(field.key),
        y: yScale(field.number),
        width: barWidth - 2,
        height: height - yScale(field.number),
        fill: colorMapping(field.key),
        style: {
          transitionProperty: transitionPropertyMapping(field.key),
          transitionDuration: `${durationRef.current}ms`,
          transformOrigin: "bottom",
          transform: transformMapping(field.key)
        }
      },
      field.key
    ));
    setBars(newBars);
  }, [chartDataState, defaultChartDataState, directionForwardRef, durationRef]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0 flex-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 600 400",
      preserveAspectRatio: "none",
      className: "h-full w-full",
      children: bars
    }
  ) });
}
const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "h3",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
const Progress = reactExports.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: cn("h-full flex-1 origin-left bg-primary", indicatorClassName),
        style: { transform: `scaleX(${(value || 0) / 100})` }
      }
    )
  }
));
Progress.displayName = Root.displayName;
function ChartCardFooter({
  chartActionCounterState,
  chartCompareCounterState,
  maxChartActionCounterState,
  maxChartCompareCounterState
}) {
  const { t } = useTranslation("ChartCardFooter");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex flex-col justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        t("steps"),
        ":"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "basis-3/4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: chartActionCounterState }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            value: chartActionCounterState / maxChartActionCounterState * 100,
            indicatorClassName: `${chartActionCounterState === maxChartActionCounterState ? "bg-red-400" : ""}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: maxChartActionCounterState })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-full items-center justify-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      t("comparisons"),
      ": ",
      chartCompareCounterState,
      " /",
      " ",
      maxChartCompareCounterState
    ] }) })
  ] });
}
const Table = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
function formatComplexity(text) {
  const regex = /\^(\([^)]*\))/g;
  const parts = text.split(regex);
  const formattedText = parts.map((part, index) => {
    if (index % 2 !== 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("sup", { children: part.slice(1, -1) }, index);
    }
    return part;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: formattedText });
}
function ChartCardInfo({
  info: { best, average, worst, memory, stable }
}) {
  const { t } = useTranslation("ChartCardInfo");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-0 flex-auto items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-125", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { className: "w-125", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-inherit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: t("best") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: t("average") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: t("worst") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: t("memory") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: t("stability") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-inherit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: formatComplexity(best) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: formatComplexity(average) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: formatComplexity(worst) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: formatComplexity(memory) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: stable ? t("stable") : t("unstable") })
    ] }) })
  ] }) }) });
}
function useChartCard(useSort) {
  const {
    addChartInfoData,
    removeChartInfoData,
    globalChartActionCounterRef,
    defaultChartDataRef,
    defaultChartDataState,
    directionForwardRef
  } = useGlobalChartsInfo();
  const { sortFunctionGeneratorRef, reset, info } = useSort();
  const {
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartActionRef
  } = useChartInfo();
  const [maxChartActionCounterState, setMaxChartActionCounterState] = reactExports.useState(0);
  const [maxChartCompareCounterState, setMaxChartCompareCounterState] = reactExports.useState(0);
  const [chartDataState, setChartDataState] = reactExports.useState(
    () => chartDataRef.current
  );
  const [chartActionCounterState, setChartActionCounterState] = reactExports.useState(() => chartActionCounterRef.current);
  const [chartCompareCounterState, setChartCompareCounterState] = reactExports.useState(() => chartCompareCounterRef.current);
  const updateStates = reactExports.useCallback(() => {
    setChartDataState({ ...chartDataRef.current });
    setChartActionCounterState(chartActionCounterRef.current);
    setChartCompareCounterState(chartCompareCounterRef.current);
  }, [chartActionCounterRef, chartCompareCounterRef, chartDataRef]);
  const resetSort = reactExports.useCallback(() => {
    chartDataRef.current = defaultChartDataRef.current;
    chartActionCounterRef.current = 0;
    chartCompareCounterRef.current = 0;
    chartActionRef.current = CHART_ACTION.DEFAULT;
    reset();
  }, [
    chartActionCounterRef,
    chartActionRef,
    chartCompareCounterRef,
    chartDataRef,
    defaultChartDataRef,
    reset
  ]);
  const nextStep = reactExports.useCallback(() => {
    const result = sortFunctionGeneratorRef.current.next();
    if (result.done) {
      visualizeChartDataFields(
        chartDataRef,
        chartCompareCounterRef,
        CHART_ACTION.FINISHED,
        []
      );
      chartActionRef.current = CHART_ACTION.FINISHED;
    }
  }, [
    chartActionRef,
    chartCompareCounterRef,
    chartDataRef,
    sortFunctionGeneratorRef
  ]);
  const setStep = reactExports.useCallback(() => {
    let step = globalChartActionCounterRef.current;
    if (step > maxChartActionCounterRef.current) {
      if (chartActionRef.current === CHART_ACTION.FINISHED) {
        return;
      }
      step = maxChartActionCounterRef.current;
    }
    if (step < chartActionCounterRef.current) {
      directionForwardRef.current = false;
      resetSort();
    } else {
      directionForwardRef.current = true;
      step -= chartActionCounterRef.current;
    }
    while (step > 0) {
      nextStep();
      chartActionCounterRef.current++;
      step--;
    }
    updateStates();
  }, [
    chartActionCounterRef,
    chartActionRef,
    directionForwardRef,
    globalChartActionCounterRef,
    maxChartActionCounterRef,
    nextStep,
    resetSort,
    updateStates
  ]);
  const controlData = reactExports.useRef({
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartActionRef,
    setStep
  });
  reactExports.useEffect(() => {
    while (chartActionRef.current !== CHART_ACTION.FINISHED) {
      nextStep();
      chartActionCounterRef.current++;
    }
    maxChartActionCounterRef.current = chartActionCounterRef.current;
    maxChartCompareCounterRef.current = chartCompareCounterRef.current;
    resetSort();
    setStep();
    addChartInfoData(controlData);
    setMaxChartActionCounterState(maxChartActionCounterRef.current);
    setMaxChartCompareCounterState(maxChartCompareCounterRef.current);
    updateStates();
    return () => {
      removeChartInfoData(controlData);
      resetSort();
    };
  }, [
    addChartInfoData,
    chartActionCounterRef,
    chartActionRef,
    chartCompareCounterRef,
    defaultChartDataState,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    nextStep,
    removeChartInfoData,
    resetSort,
    setStep,
    updateStates
  ]);
  return {
    chartDataState,
    chartActionCounterState,
    chartCompareCounterState,
    maxChartActionCounterState,
    maxChartCompareCounterState,
    info
  };
}
function ChartCardContent({
  useSort,
  showInfo
}) {
  const {
    chartDataState,
    chartActionCounterState,
    chartCompareCounterState,
    maxChartActionCounterState,
    maxChartCompareCounterState,
    info
  } = useChartCard(useSort);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex grow flex-col justify-center p-6 pt-0", children: showInfo ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCardInfo, { info }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChartBarChart, { chartDataState }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChartCardFooter,
      {
        chartActionCounterState,
        chartCompareCounterState,
        maxChartActionCounterState,
        maxChartCompareCounterState
      }
    )
  ] });
}
function ChartCard({ algorithm, flippedProps }) {
  const {
    setAlgorithmsVisibility,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight
  } = useAlgorithmsVisibility();
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CHART_CARD,
    algorithm
  );
  const { t } = useTranslation("AlgorithmsNames");
  const [showInfo, setShowInfo] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: `flex min-h-64 min-w-137.5 flex-col ${isDragging ? "opacity-50" : "opacity-100"}`,
      ref,
      "data-handler-id": handlerId,
      ...flippedProps,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ContextMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ContextMenuTrigger, { className: "contents", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row justify-between space-y-0 p-0 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: t(algorithm) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 justify-end gap-x-2 pr-1 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: `h-fit w-fit rounded-full p-1`,
                  variant: `${showInfo ? "reversedOutline" : "outline"}`,
                  onClick: () => setShowInfo((prev) => !prev),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex h-6 w-6 items-center justify-center text-lg", children: "i" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "h-fit w-fit rounded-full p-1",
                  variant: "outline",
                  onClick: () => setAlgorithmsVisibility(algorithm, false),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, {})
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChartCardContent,
            {
              useSort: SORTING_ALGORITHM[algorithm],
              showInfo
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ContextMenuContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ContextMenuItem,
            {
              onClick: () => setAlgorithmsVisibility(algorithm, false),
              children: "Remove (×)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenuLabel, { className: "text-center", children: "Move" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(ContextMenuGroup, { className: "flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ContextMenuItem,
              {
                onClick: () => moveAlgorithmPositionLeft(algorithm),
                children: "Left (←)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ContextMenuItem,
              {
                onClick: () => moveAlgorithmPositionRight(algorithm),
                children: "Right (→)"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function ChartCardWrapper({ algorithm, flippedProps }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ChartInfoProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { algorithm, flippedProps }) });
}
function StartCard() {
  const { t } = useTranslation("StartCard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: t("welcome") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex grow flex-col items-center justify-center p-6 pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-w-2xl flex-col items-center space-y-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("visibility") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("order") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("dane") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("theme") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("controls") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("info") })
    ] }) })
  ] });
}
const Route = createLazyFileRoute("/")({
  component: Index
});
function Index() {
  const { algorithmsVisibilityData, draggablesTransitionStateRef } = useAlgorithmsVisibility();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ContextMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenuTrigger, { className: "contents", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full grid-cols-chartsBoard gap-4 p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      h,
      {
        className: "contents",
        flipKey: `charts${JSON.stringify(algorithmsVisibilityData)}`,
        onStart: () => draggablesTransitionStateRef.current[DRAG_ITEM_TYPE.CHART_CARD] = true,
        onComplete: () => draggablesTransitionStateRef.current[DRAG_ITEM_TYPE.CHART_CARD] = false,
        children: [
          algorithmsVisibilityData.filter(({ visible }) => visible === true).map(({ algorithm }) => /* @__PURE__ */ jsxRuntimeExports.jsx(v, { flipId: `chart${algorithm}`, children: (flippedProps) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChartCardWrapper,
            {
              algorithm,
              flippedProps
            }
          ) }, `chart${algorithm}`)),
          algorithmsVisibilityData.every(
            ({ visible }) => visible === false
          ) && /* @__PURE__ */ jsxRuntimeExports.jsx(StartCard, {})
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenuContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      h,
      {
        className: "contents",
        flipKey: `chartsContexts${algorithmsVisibilityData.map(({ algorithm }) => algorithm).join("")}`,
        children: algorithmsVisibilityData.map(({ algorithm, visible }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          v,
          {
            flipId: `chartContextItem${algorithm}`,
            onStart: () => draggablesTransitionStateRef.current[DRAG_ITEM_TYPE.CONTEXT_ITEM] = true,
            onComplete: () => draggablesTransitionStateRef.current[DRAG_ITEM_TYPE.CONTEXT_ITEM] = false,
            children: (flippedProps) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlgorithmContextMenuCheckboxItem,
              {
                algorithm,
                visible,
                flippedProps
              }
            )
          },
          `chartContextItem${algorithm}`
        ))
      }
    ) })
  ] });
}
export {
  Route
};

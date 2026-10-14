import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { Button } from '@once-ui-system/core/components/Button';
import { Dropdown } from '@once-ui-system/core/components/Dropdown';

export function Menu({
  label,
  variant = 'tertiary',
  align = 'end',
  children,
  busy = false,
}: {
  label: string;
  variant?: 'secondary' | 'tertiary';
  align?: 'start' | 'end';
  children: (close: () => void) => ReactNode;
  busy?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLElement | null>(null);
  const { refs, floatingStyles, isPositioned } = useFloating({
    open,
    strategy: 'fixed',
    placement: `bottom-${align}`,
    middleware: [offset(8), flip(), shift({ padding: 16 })],
    whileElementsMounted: autoUpdate,
  });
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!open || !isPositioned) return;
    const panel = refs.floating.current;
    (
      panel?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)') ||
      panel
    )?.focus();
  }, [open, isPositioned, refs.floating]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const node = event.target as Node;
      if (
        !refs.floating.current?.contains(node) &&
        !trigger.current?.contains(node)
      )
        setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open, refs.floating]);
  const keyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      close();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [
      ...(refs.floating.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not(:disabled)',
      ) || []),
    ];
    if (!buttons.length) return;
    const current = buttons.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : (current + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) %
            buttons.length;
    buttons[next].focus();
  };
  return (
    <div className="menu-control">
      <Button
        ref={(node) => {
          trigger.current = node;
          refs.setReference(node);
        }}
        type="button"
        variant={variant}
        rounded
        size="s"
        loading={busy}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {label}
        <span className="chevron" aria-hidden="true">
          ⌄
        </span>
      </Button>
      {open &&
        createPortal(
          <Dropdown
            ref={refs.setFloating}
            style={floatingStyles}
            id={id}
            role="menu"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={keyboard}
            data-site-menu=""
            padding={6}
            radius="l"
          >
            {children(close)}
          </Dropdown>,
          document.body,
        )}
    </div>
  );
}

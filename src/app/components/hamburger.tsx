"use client"
import React, { useState } from 'react'

/**
 * Controlled or uncontrolled hamburger toggle.
 * - Controlled usage: <HamburgerButton isOpen={open} onClick={() => setOpen(!open)} />
 * - Uncontrolled usage: <HamburgerButton onToggle={(open) => console.log(open)} />
 */

type HamburgerButtonProps = {
    isOpen?: boolean;
    onClick?: () => void;
    onToggle?: (open: boolean) => void;
    className?: string;
};

export const HamburgerButton = ({ isOpen, onClick, onToggle, className = '' }: HamburgerButtonProps) => {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = isOpen !== undefined;
    const open = isControlled ? isOpen : internalOpen;

    const handleClick = () => {
        if (onClick) onClick();
        if (!isControlled) {
            const next = !internalOpen;
            setInternalOpen(next);
            onToggle?.(next);
        } else {
            onToggle?.(!open);
        }
    };

    return (
        <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            title={open ? "Close menu" : "Open menu"}
            onClick={handleClick}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 ${className}`}
        >
            <span className="relative h-4 w-4">
                <span
                    className={`absolute left-0 top-0 h-[2px] w-4 origin-center rounded-full bg-current transition-all duration-300 ease-in-out
                        ${open ? "top-[7px] rotate-45" : "top-0 rotate-0"}`}
                />
                <span
                    className={`absolute left-0 top-[7px] h-[2px] w-4 rounded-full bg-current transition-all duration-300 ease-in-out
                        ${open ? "opacity-0" : "opacity-100"}`}
                />
                <span
                    className={`absolute left-0 bottom-0 h-[2px] w-4 origin-center rounded-full bg-current transition-all duration-300 ease-in-out
                        ${open ? "bottom-[7px] -rotate-45" : "bottom-0 rotate-0"}`}
                />
            </span>
        </button>
    )
}
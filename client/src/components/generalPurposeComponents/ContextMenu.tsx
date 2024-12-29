import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface ContextMenuItem {
    label: string;
    onClick: () => void;
}

export interface ContextMenuProps {
    isOpen: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
}

export default function ContextMenu({ isOpen, x, y, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x, y });

    useLayoutEffect(() => {
        function updatePosition() {
            if (menuRef.current) {
                const { width, height } = menuRef.current.getBoundingClientRect();
                const maxX = window.innerWidth - width;
                const maxY = window.innerHeight - height;

                setPosition({
                    x: Math.min(x, maxX),
                    y: Math.min(y, maxY)
                });
            }
        }

        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
        } else {
            window.removeEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, x, y, items.length]);

    useEffect(() => {
        function handleInteraction(event: Event) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleInteraction);
            document.addEventListener('scroll', handleInteraction, true);
            document.addEventListener('touchstart', handleInteraction);
            window.addEventListener('resize', handleInteraction);
        } else {
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('scroll', handleInteraction, true);
            document.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('resize', handleInteraction);
        }

        return () => {
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('scroll', handleInteraction, true);
            document.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('resize', handleInteraction);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <motion.div
            ref={menuRef}
            className="z-[3000] absolute"
            style={{top: `${position.y - 50}px`, left: `${position.x}px`}}
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            transition={{duration: 0.3}}
        >
            <div
                className="bg-white dark:bg-dark-tremor-background rounded-lg border border-[#ddeeee] dark:border-[#444444]">
                {items.map((item, index) => (
                    <div key={index}
                         className="px-2.5 py-2 hover:bg-[#f5f5f5] dark:hover:bg-dark-tremor-background border-b border-[#ddeeee] dark:border-[#444444] last:border-0"
                         onClick={item.onClick}>
                        {item.label}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
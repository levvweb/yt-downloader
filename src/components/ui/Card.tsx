import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
                "glass-card overflow-hidden rounded-3xl p-6",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

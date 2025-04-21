import { motion } from "framer-motion"
export const Vault: React.FC = () => {

    return (
        <motion.svg
            width="200"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ amount: 0.2, once: false }}
        >
            {/* The Rect (vault's outer box) */}
            <motion.rect
                x="1.48"
                y="1.5"
                width="21.04"
                height="19.13"
                rx="1.91"
                stroke="#f1f5f9"
                strokeWidth="1.91"
                fill="none"
                strokeDasharray="80"
                strokeDashoffset="80"
                initial={{ strokeDashoffset: 80 }}
                whileInView={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Left Vertical Line */}
            <motion.line
                x1="4.35"
                y1="23.5"
                x2="4.35"
                y2="20.63"
                stroke="#f1f5f9"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Right Vertical Line */}
            <motion.line
                x1="19.65"
                y1="23.5"
                x2="19.65"
                y2="20.63"
                stroke="#f1f5f9"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Central Circle */}
            <motion.circle
                cx="10.09"
                cy="11.07"
                r="4.78"
                stroke="#e2e8f0"
                strokeWidth="1.91"
                fill="none"
                strokeDasharray="30" // You can adjust this value to match your circle's perimeter
                strokeDashoffset="30" // Start the circle with the dash offset (hidden)
                initial={{ strokeDashoffset: 30 }}
                whileInView={{ strokeDashoffset: 0 }} // Animate it to 0 (completing the circle)
                transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Horizontal Lines */}
            <motion.line
                x1="17.74"
                y1="9.15"
                x2="19.65"
                y2="9.15"
                stroke="#dce6f5"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />
            <motion.line
                x1="17.74"
                y1="12.98"
                x2="19.65"
                y2="12.98"
                stroke="#dce6f5"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.75, ease: 'easeOut' }}
            />
            <motion.line
                x1="17.74"
                y1="16.8"
                x2="19.65"
                y2="16.8"
                stroke="#dce6f5"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.75, delay: 0.25, ease: 'easeOut' }}
            />

            {/* Vertical Line in the Center */}
            <motion.line
                x1="10.09"
                y1="4.37"
                x2="10.09"
                y2="11.07"
                stroke="#e2e8f0"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Left Diagonal Line */}
            <motion.line
                x1="4.35"
                y1="15.85"
                x2="10.09"
                y2="11.07"
                stroke="#e2e8f0"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Right Diagonal Line */}
            <motion.line
                x1="15.83"
                y1="15.85"
                x2="10.09"
                y2="11.07"
                stroke="#e2e8f0"
                strokeWidth="1.91"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />
        </motion.svg>
    )
}
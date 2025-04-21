

export const slideInTop = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.8,
            ease: 'easeOut',
        },
    },
};
export const sectionFadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1.5
        }
    },
}
export const slideInTopDelay = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.5,
            ease: 'easeOut',
        },
    },
};
export const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.3, // shorter delay for a snappier feel
        },
    },
};
export const slideInBottom = {
    hidden: { y: 60 },
    visible: {
        y: 0,
        transition: {
            duration: 0.75,
        }
    }
}
export const slideInRight = {
    hidden: { x: 60 },
    visible: {
        x: 0,
        transition: {
            duration: 0.6,
        }
    }
}
export const slideInRightDelay = {
    hidden: { x: 60 },
    visible: {
        x: 0,
        transition: {
            duration: 0.6,
            delay: 0.15
        }
    }
}
export const child = {
    hidden: { opacity: 0 }, // start off-screen left
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeOut",
        },
    },
};
export const liquidationInfoVariant = {
    hidden: { y: 100 },
    visible: {
        y: 0,
        transition: {
            duration: 0.15,
            staggerChildren: 0.5
        }
    }
}

export const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const itemVariants = {
    hidden: { y: 50 },
    visible: {
        y: 0,
        transition: {
            duration: 0.15,
            ease: "easeOut"
        }
    }
};

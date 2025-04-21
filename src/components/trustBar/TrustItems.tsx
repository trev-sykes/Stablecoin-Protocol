import { BookOpen, Clock, Globe, LockKeyhole, LockIcon, ShieldCheck } from "lucide-react";

export const trustItems = [
    { text: "100% Asset Backed", icon: <ShieldCheck /> },
    { text: "Chainlink Oracle Secured", icon: <LockKeyhole /> },
    { text: "Audited Smart Contracts", icon: <BookOpen /> },
    { text: "Real-time Security Monitoring", icon: <Clock /> },
    { text: "Non-custodial Protocol", icon: <LockIcon /> },
    { text: "Open-source Codebase", icon: <Globe /> },
    // Additional items if needed for scrolling effect
];
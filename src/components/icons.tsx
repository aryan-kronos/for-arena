import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
export const UserIcon = (p: Props) => <svg {...base} {...p}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
export const PhoneIcon = (p: Props) => <svg {...base} {...p}><path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 2.2a15.2 15.2 0 0 1-10-10L8 7z"/></svg>;
export const LockIcon = (p: Props) => <svg {...base} {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
export const KeyIcon = (p: Props) => <svg {...base} {...p}><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9m-3 3 3 3m-6 0 3 3"/></svg>;
export const QrIcon = (p: Props) => <svg {...base} {...p}><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm13 0h2v2h-2zm-2 4h2v3h-2zm4 0h3v3h-3zm2-4h1v2h-1z"/></svg>;
export const ShieldIcon = (p: Props) => <svg {...base} {...p}><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-5"/></svg>;
export const DownloadIcon = (p: Props) => <svg {...base} {...p}><path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/></svg>;
export const EyeIcon = (p: Props) => <svg {...base} {...p}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="3"/></svg>;
export const EyeOffIcon = (p: Props) => <svg {...base} {...p}><path d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.5 16.5 0 0 1-2.2 2.8M6.1 6.1C3.7 8 2.5 12 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6M9.9 9.9A3 3 0 0 0 14.1 14.1"/></svg>;

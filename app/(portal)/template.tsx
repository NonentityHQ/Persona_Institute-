import { PageStage } from '@/components/motion/RouteTransition';
export default function PortalTemplate({ children }: { children: React.ReactNode }) { return <PageStage>{children}</PageStage>; }

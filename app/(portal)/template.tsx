import { PageStage } from '@/components/motion/RouteTransition';
import AutoMotion from '@/components/motion/AutoMotion';

export default function PortalTemplate({ children }: { children: React.ReactNode }) {
  return <><PageStage>{children}</PageStage><AutoMotion /></>;
}

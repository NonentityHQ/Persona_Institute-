import { PageStage } from '@/components/motion/RouteTransition';
import AutoMotion from '@/components/motion/AutoMotion';

export default function LoginTemplate({ children }: { children: React.ReactNode }) {
  return <><PageStage>{children}</PageStage><AutoMotion /></>;
}

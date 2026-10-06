import type { ReactNode } from 'react';
import { InfoShell } from '@/components/info/InfoShell';

export default function InformationLayout({ children }: { children: ReactNode }) {
  return <InfoShell>{children}</InfoShell>;
}

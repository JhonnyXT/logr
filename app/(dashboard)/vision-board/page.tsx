"use client";

import {
  Calendar,
  Compass,
  ListChecks,
  MapPin,
  Scroll,
  Trophy,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LockedFeatureGate } from "@/components/shared/LockedFeatureGate";
import { Card } from "@/components/ui/card";
import { EulogyMethod } from "@/components/vision-board/EulogyMethod";
import { BucketList } from "@/components/vision-board/BucketList";
import { MissionStatement } from "@/components/vision-board/MissionStatement";
import { DefinitionOfSuccess } from "@/components/vision-board/DefinitionOfSuccess";
import { OdysseyPlan } from "@/components/vision-board/OdysseyPlan";
import { FutureCalendar } from "@/components/vision-board/FutureCalendar";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLocale } from "@/contexts/locale-context";

const PREVIEW_ICONS = [Scroll, ListChecks, Compass, Trophy, MapPin, Calendar] as const;

function VisionLockedPreview() {
  const { t } = useLocale();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t.vision.pageTitle}
        subtitle={t.vision.subtitle}
        description={t.vision.pageDesc}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PREVIEW_ICONS.map((Icon, i) => (
          <Card key={i} className="flex flex-col gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-5 w-5" />
            </div>
            <div className="h-4 w-3/4 rounded bg-border" />
            <div className="h-3 w-full rounded bg-border/70" />
            <div className="mt-auto h-16 rounded-lg bg-border/50" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function VisionBoardContent() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader title={t.vision.pageTitle} subtitle={t.vision.subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <EulogyMethod />
        <BucketList />
        <MissionStatement />
        <DefinitionOfSuccess />
        <OdysseyPlan />
        <FutureCalendar />
      </div>
    </div>
  );
}

export default function VisionBoardPage() {
  const { data: level, isLoading } = useUserLevel();

  if (isLoading || level === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-border" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-border/60" />
          ))}
        </div>
      </div>
    );
  }

  if (level < 3) {
    return (
      <LockedFeatureGate featureKey="vision_board" userLevel={level}>
        <VisionLockedPreview />
      </LockedFeatureGate>
    );
  }

  return <VisionBoardContent />;
}

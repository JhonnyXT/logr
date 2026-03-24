"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { getYearDays, toDateString, format, startOfWeek } from "@/lib/utils/date";
import { GridCell, getIntensity, type IntensityLevel } from "./GridCell";
import { GridTooltip } from "./GridTooltip";
import { cn } from "@/lib/utils/cn";
import type { ActivityDay } from "@/types/gamification";

interface ActivityGridProps {
  year?: number;
  data: ActivityDay[];
  className?: string;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ActivityGrid({ year, data, className }: ActivityGridProps) {
  const currentYear = year ?? new Date().getFullYear();
  const [tooltip, setTooltip] = useState<{
    date: string;
    actionsCount: number;
    xpEarned: number;
    position: { x: number; y: number };
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const activityMap = useMemo(() => {
    const map = new Map<string, { actionsCount: number; xpEarned: number }>();
    for (const day of data) {
      map.set(day.date, { actionsCount: day.actionsCount, xpEarned: day.xpEarned });
    }
    return map;
  }, [data]);

  const { weeks, monthPositions, totalActions } = useMemo(() => {
    const days = getYearDays(currentYear);
    const firstDay = days[0];
    const firstWeekStart = startOfWeek(firstDay, { weekStartsOn: 0 });

    const weeksList: {
      date: string;
      actionsCount: number;
      xpEarned: number;
      intensity: IntensityLevel;
      dayOfWeek: number;
    }[][] = [];

    let currentWeek: typeof weeksList[number] = [];
    let totalActs = 0;
    const monthPos: { month: number; weekIndex: number }[] = [];
    let lastMonth = -1;

    for (const day of days) {
      const dateStr = toDateString(day);
      const dayOfWeek = day.getDay();
      const activity = activityMap.get(dateStr);
      const actionsCount = activity?.actionsCount ?? 0;
      const xpEarned = activity?.xpEarned ?? 0;
      totalActs += actionsCount;

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }

      const month = day.getMonth();
      if (month !== lastMonth) {
        monthPos.push({ month, weekIndex: weeksList.length });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        actionsCount,
        xpEarned,
        intensity: getIntensity(actionsCount),
        dayOfWeek,
      });
    }

    if (currentWeek.length > 0) weeksList.push(currentWeek);

    return { weeks: weeksList, monthPositions: monthPos, totalActions: totalActs };
  }, [currentYear, activityMap]);

  const handleCellHover = useCallback(
    (data: { date: string; actionsCount: number; xpEarned: number } | null) => {
      if (!data) {
        setTooltip(null);
        return;
      }
      const cell = gridRef.current?.querySelector(`[data-date="${data.date}"]`);
      if (cell) {
        const rect = cell.getBoundingClientRect();
        setTooltip({
          ...data,
          position: { x: rect.left + rect.width / 2, y: rect.top },
        });
      }
    },
    []
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Actividad {currentYear}
        </h3>
        <p className="text-xs text-muted">
          {totalActions.toLocaleString()} {totalActions === 1 ? "contribución" : "contribuciones"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div ref={gridRef} className="inline-flex flex-col gap-1">
          <div className="flex gap-[3px] pl-8 text-[10px] text-muted">
            {monthPositions.map(({ month, weekIndex }) => (
              <span
                key={month}
                style={{
                  position: "relative",
                  left: `${weekIndex * 16}px`,
                }}
                className="absolute"
              >
                {MONTH_LABELS[month]}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-[3px]">
            <div className="flex flex-col gap-[3px] pr-2 pt-0">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex h-[13px] items-center text-[10px] text-muted"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const cell = week.find((c) => c.dayOfWeek === dayIdx);
                    if (!cell) {
                      return (
                        <div
                          key={dayIdx}
                          className="h-[13px] w-[13px]"
                        />
                      );
                    }
                    return (
                      <GridCell
                        key={cell.date}
                        date={cell.date}
                        actionsCount={cell.actionsCount}
                        xpEarned={cell.xpEarned}
                        intensity={cell.intensity}
                        onHover={handleCellHover}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted">
            <span>Menos</span>
            {([0, 1, 2, 3, 4] as IntensityLevel[]).map((level) => (
              <div
                key={level}
                className={cn(
                  "h-[10px] w-[10px] rounded-[2px]",
                  level === 0 && "bg-grid-empty",
                  level === 1 && "bg-grid-1",
                  level === 2 && "bg-grid-2",
                  level === 3 && "bg-grid-3",
                  level === 4 && "bg-grid-4"
                )}
              />
            ))}
            <span>Más</span>
          </div>
        </div>
      </div>

      {tooltip && (
        <GridTooltip
          date={tooltip.date}
          actionsCount={tooltip.actionsCount}
          xpEarned={tooltip.xpEarned}
          position={tooltip.position}
        />
      )}
    </div>
  );
}

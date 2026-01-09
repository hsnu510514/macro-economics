"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries, type IChartApi } from "lightweight-charts";

/**
 * Attribution Notice:
 * This application uses Lightweight Charts™ (c) 2018-2024 TradingView, Inc. 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

interface ChartDataPoint {
  time: string;
  value: number;
}

interface IndicatorChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  fullSize?: boolean;
  lineColor?: string;
  areaTopColor?: string;
  areaBottomColor?: string;
}

export function IndicatorChart({
  data,
  height = 100,
  width,
  fullSize = false,
  lineColor = "hsl(var(--primary))",
  areaTopColor = "hsl(var(--primary) / 0.2)",
  areaBottomColor = "hsl(var(--primary) / 0)",
}: IndicatorChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartHeight = fullSize ? 400 : height;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: fullSize },
        horzLines: { visible: fullSize },
      },
      width: width ?? chartContainerRef.current.clientWidth,
      height: chartHeight,
      rightPriceScale: {
        visible: fullSize,
        borderVisible: false,
      },
      timeScale: {
        visible: fullSize,
        borderVisible: false,
      },
      handleScroll: fullSize,
      handleScale: fullSize,
      crosshair: {
        mode: fullSize ? 1 : 0, // 1 = Normal, 0 = Hidden
      },
    });

    chartRef.current = chart;

    const areaSeries = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: fullSize,
    });

    // Convert data to chart format
    const chartData = data.map((d) => ({
      time: d.time,
      value: d.value,
    }));

    areaSeries.setData(chartData as any);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height, width, fullSize, lineColor, areaTopColor, areaBottomColor]);

  return (
    <div
      ref={chartContainerRef}
      className={fullSize ? "w-full" : "w-full"}
      style={{ height: fullSize ? 400 : height }}
    />
  );
}

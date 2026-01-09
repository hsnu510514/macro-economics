import { jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
function IndicatorChart({
  data,
  height = 100,
  width,
  fullSize = false,
  lineColor = "hsl(var(--primary))",
  areaTopColor = "hsl(var(--primary) / 0.2)",
  areaBottomColor = "hsl(var(--primary) / 0)"
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chartHeight = fullSize ? 400 : height;
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        attributionLogo: false
      },
      grid: {
        vertLines: { visible: fullSize },
        horzLines: { visible: fullSize }
      },
      width: width ?? chartContainerRef.current.clientWidth,
      height: chartHeight,
      rightPriceScale: {
        visible: fullSize,
        borderVisible: false
      },
      timeScale: {
        visible: fullSize,
        borderVisible: false
      },
      handleScroll: fullSize,
      handleScale: fullSize,
      crosshair: {
        mode: fullSize ? 1 : 0
        // 1 = Normal, 0 = Hidden
      }
    });
    chartRef.current = chart;
    const areaSeries = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: fullSize
    });
    const chartData = data.map((d) => ({
      time: d.time,
      value: d.value
    }));
    areaSeries.setData(chartData);
    chart.timeScale().fitContent();
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height, width, fullSize, lineColor, areaTopColor, areaBottomColor]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: chartContainerRef,
      className: fullSize ? "w-full" : "w-full",
      style: { height: fullSize ? 400 : height }
    }
  );
}
export {
  IndicatorChart as I
};

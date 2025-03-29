import { fetchCoinHistory } from "../api";
import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";
import { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import styled from "styled-components";

const ChartTypeButton = styled.button<{ $isCandlestick: boolean }>`
  background: ${(props) => (props.$isCandlestick ? "#2c3e50" : "transparent")};
  color: ${(props) => (props.$isCandlestick ? "white" : "#95a5a6")};
  padding: 5px 10px;
  border: 1px solid #95a5a6;
  border-radius: 5px;
  cursor: pointer;
`;

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

// interface IGeckoHistorical {
//   time_open: number;
//   time_close: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
// }

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId),
  );

  const expectedData = data?.map((price) => {
    return {
      x: new Date(price.time_close).toLocaleDateString(),
      y: [price.open, price.high, price.low, price.close],
    };
  });

  const ohlcData = expectedData ?? [];

  const [isCandlestick, setIsCandlestick] = useState<boolean>(true);
  const toggleChartType = () => {
    setIsCandlestick((current) => !current);
  };

  // 공통 차트 옵션
  const commonChartOptions = useMemo(
    (): ApexOptions => ({
      theme: {
        mode: "dark",
      },
      chart: {
        height: 300,
        width: 500,
        toolbar: {
          show: false,
        },
        background: "transparent",
      },
    }),
    [],
  );

  // 캔들스틱 차트 옵션
  const candlestickOptions = useMemo(
    (): ApexOptions => ({
      ...commonChartOptions,
    }),
    [commonChartOptions],
  );

  // 라인 차트 옵션
  const lineChartOptions = useMemo(
    (): ApexOptions => ({
      ...commonChartOptions,
      grid: { show: false },
      yaxis: { show: false },
      xaxis: {
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false },
        categories: data?.map((price) =>
          new Date(price.time_close).toLocaleDateString(),
        ),
      },
      tooltip: {
        y: {
          formatter: (value: number) => `$${value.toFixed(2)}`,
        },
      },
      stroke: {
        curve: "smooth" as const,
      },
      fill: {
        type: "gradient",
        gradient: { gradientToColors: ["#0BE881"], stops: [0, 100] },
      },
      colors: ["#0FBCF9"],
    }),
    [commonChartOptions, data],
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <ChartTypeButton
              onClick={toggleChartType}
              $isCandlestick={isCandlestick}
            >
              캔들스틱
            </ChartTypeButton>
            <ChartTypeButton
              onClick={toggleChartType}
              $isCandlestick={!isCandlestick}
            >
              라인
            </ChartTypeButton>
          </div>
          {isCandlestick ? (
            <ApexChart
              key="candlestick"
              type="candlestick"
              series={[{ data: ohlcData }]}
              options={candlestickOptions}
            />
          ) : (
            <ApexChart
              key="line"
              type="line"
              series={[
                {
                  name: "close price",
                  data: data?.map((price) => Number(price.close)) ?? [],
                },
              ]}
              options={lineChartOptions}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Chart;

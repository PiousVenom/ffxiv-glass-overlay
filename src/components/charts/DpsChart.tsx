import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import type { PerformancePoint } from '../../types';
import { getPlayerDpsHistory } from '../../hooks/usePerformanceData';
import { getRoleColor } from '../../constants/Jobs';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DpsChartProps {
  /** Performance data points */
  performanceData: PerformancePoint[];
  /** Player name to show chart for */
  playerName: string;
  /** Player job abbreviation */
  job: string;
}

/**
 * DPS over time line chart
 */
export function DpsChart({ performanceData, playerName, job }: DpsChartProps) {
  const { t } = useTranslation();

  const { timestamps, values } = useMemo(
    () => getPlayerDpsHistory(performanceData, playerName),
    [performanceData, playerName]
  );

  const roleColor = getRoleColor(job);

  // Format timestamps as relative time labels
  const labels = useMemo(() => {
    if (timestamps.length === 0) return [];
    const startTime = timestamps[0];
    return timestamps.map((ts) => {
      const seconds = Math.floor((ts - startTime) / 1000);
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    });
  }, [timestamps]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'DPS',
          data: values,
          borderColor: roleColor,
          backgroundColor: `${roleColor}33`,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    }),
    [labels, values, roleColor]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: t('playerDetail.charts.dpsOverTime'),
          color: 'rgba(255, 255, 255, 0.87)',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: { parsed: { y: number | null } }) => {
              const value = context.parsed.y ?? 0;
              return `DPS: ${Math.round(value).toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            font: {
              size: 9,
            },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            font: {
              size: 9,
            },
            callback: (value: number | string) => {
              const numValue = typeof value === 'number' ? value : parseFloat(value);
              if (numValue >= 1000) {
                return `${(numValue / 1000).toFixed(1)}k`;
              }
              return numValue;
            },
          },
        },
      },
    }),
    [t]
  );

  if (performanceData.length < 2) {
    return (
      <div className="chart-placeholder">
        <span>{t('playerDetail.charts.dpsOverTime')}</span>
        <span className="hint">Collecting data...</span>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}

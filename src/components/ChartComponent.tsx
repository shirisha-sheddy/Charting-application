import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, ChartOptions } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import './ChartComponent.css'; // Import the CSS file

ChartJS.register(...registerables, zoomPlugin);

interface DataPoint {
  timestamp: string;
  value: number;
}

const ChartComponent: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const chartRef = useRef<any>(null);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data: DataPoint[]) => setData(data));
  }, []);

  const handleExport = () => {
    if (chartRef.current === null || chartRef.current.canvas === null) {
      return;
    }

    toPng(chartRef.current.canvas, { cacheBust: true })
      .then((dataUrl) => {
        download(dataUrl, 'chart.png');
      })
      .catch((err) => {
        console.error('Failed to export chart as image', err);
      });
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe,
        },
      },
      y: {
        type: 'linear',
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as 'x',
        },
      },
    },
  };

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Value',
        data: data.map((d) => ({ x: new Date(d.timestamp), y: d.value })),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return (
    <div className="container">
      <div className="buttons">
        <button onClick={() => setTimeframe('day')}>Daily</button>
        <button onClick={() => setTimeframe('week')}>Weekly</button>
        <button onClick={() => setTimeframe('month')}>Monthly</button>
        <button onClick={handleExport}>Export as PNG</button>
      </div>
      <div>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;

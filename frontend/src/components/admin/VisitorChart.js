import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * 방문자 차트 컴포넌트
 * @param {Object} props
 * @param {Object} props.data 일별 방문자 데이터
 */
const VisitorChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data) return;

    // 차트 데이터 준비
    const dates = Object.keys(data).sort();
    const visitorCounts = dates.map(date => data[date]);

    // 기존 차트 인스턴스 제거
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 차트 생성
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '일별 방문자 수',
            data: visitorCounts,
            backgroundColor: 'rgba(106, 90, 205, 0.2)',
            borderColor: 'rgba(106, 90, 205, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(106, 90, 205, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `방문자: ${context.raw.toLocaleString()}명`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    });

    // 컴포넌트 언마운트 시 차트 제거
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="visitor-chart">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default VisitorChart;
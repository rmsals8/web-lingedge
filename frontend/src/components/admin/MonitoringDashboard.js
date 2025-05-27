// src/pages/admin/MonitoringDashboard.js
import React from 'react';

function MonitoringDashboard() {
  return (
    <div className="monitoring-container">
      <h1 className="page-title">시스템 모니터링 대시보드</h1>
      <p className="page-description">
        실시간 시스템 성능 지표 및 애플리케이션 상태를 확인할 수 있습니다.
      </p>
      
      <div className="dashboard-iframe-wrapper">
        <iframe
          src="http://13.209.15.189:3000/public-dashboards/5a9055cf656b4e62a8a748b73d5a3941"
          width="100%"
          height="800"
          frameBorder="0"
          title="시스템 모니터링 대시보드"
        ></iframe>
      </div>
    </div>
  );
}

export default MonitoringDashboard;
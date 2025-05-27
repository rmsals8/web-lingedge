// src/components/admin/Monitoring.js
import React, { useState } from 'react';

function Monitoring() {
  const [activeTab, setActiveTab] = useState('spring');

  return (
    <div className="monitoring-container">
      <h1 className="section-title">시스템 모니터링</h1>
      <p className="section-description">
        서버 및 애플리케이션 상태를 실시간으로 모니터링합니다.
      </p>
      
      <div className="tabs flex border-b mb-4">
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'spring' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('spring')}
        >
          스프링 부트
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'mariadb' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('mariadb')}
        >
          MariaDB
        </button>
      </div>
      
      <div className="dashboard-iframe-wrapper">
        {activeTab === 'spring' ? (
          <iframe
            src="http://13.209.15.189:3000/public-dashboards/spring-dashboard-id"
            width="100%"
            height="800"
            frameBorder="0"
            title="Spring Boot 모니터링 대시보드"
          ></iframe>
        ) : (
          <iframe
            src="http://13.209.15.189:3000/public-dashboards/mariadb-dashboard-id"
            width="100%"
            height="800"
            frameBorder="0"
            title="MariaDB 모니터링 대시보드"
          ></iframe>
        )}
      </div>
    </div>
  );
}

export default Monitoring;
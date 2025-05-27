import React, { useState, useEffect } from 'react';
import statisticsService from '../../services/statisticsService';
import VisitorChart from './VisitorChart';
import CountryMap from './CountryMap';
import { FaUsers, FaGlobe, FaTicketAlt, FaCheck, FaRedoAlt } from 'react-icons/fa';
import { getDaysAgo, formatDate } from '../../utils/dateUtils';

/**
 * 통계 카드 컴포넌트
 */
const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <h3 className="stat-card-title">{title}</h3>
      <div className="stat-card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
    <div className="stat-card-value">{value.toLocaleString()}</div>
  </div>
);

/**
 * 관리자 대시보드 컴포넌트
 */
const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: getDaysAgo(30),
    endDate: new Date()
  });
  
  const [visitorStats, setVisitorStats] = useState(null);
  const [countryStats, setCountryStats] = useState(null);
  const [inquiryStats, setInquiryStats] = useState({
    TOTAL: 0,
    PENDING: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMonitoring, setShowMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState('spring'); // 'spring' 또는 'mariadb'

  // API 호출 및 데이터 처리 함수
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 날짜 범위 포맷팅
      const startStr = formatDate(dateRange.startDate);
      const endStr = formatDate(dateRange.endDate);

      console.log('Fetching data for date range:', startStr, 'to', endStr);

      // Promise.all을 사용하여 모든 API 호출을 병렬로 처리
      const [visitorResponse, countryResponse, inquiryResponse] = await Promise.all([
        statisticsService.getDailyVisitors(startStr, endStr)
          .catch(error => {
            console.error('Error fetching visitor stats:', error);
            return { data: {} };
          }),
        statisticsService.getVisitorsByCountry(startStr, endStr)
          .catch(error => {
            console.error('Error fetching country stats:', error);
            return { data: {} };
          }),
        statisticsService.getInquiryStats(startStr, endStr)
          .catch(error => {
            console.error('Error fetching inquiry stats:', error);
            return { data: {} };
          })
      ]);

      console.log('API Responses received:');
      console.log('Visitor stats response:', visitorResponse);
      console.log('Country stats response:', countryResponse);
      console.log('Inquiry stats response:', inquiryResponse);

      // 응답 데이터 설정
      if (visitorResponse && visitorResponse.data) {
        setVisitorStats(visitorResponse.data);
      }

      if (countryResponse && countryResponse.data) {
        setCountryStats(countryResponse.data);
      }

      if (inquiryResponse && inquiryResponse.data) {
        const statsData = inquiryResponse.data;
        console.log('Setting inquiry stats:', statsData);
        
        setInquiryStats({
          TOTAL: statsData.TOTAL || 0,
          PENDING: statsData.PENDING || 0,
          IN_PROGRESS: statsData.IN_PROGRESS || 0,
          RESOLVED: statsData.RESOLVED || 0
        });
      } else {
        console.warn('Invalid or empty inquiry stats response:', inquiryResponse);
      }

    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    console.log('Dashboard component mounted or date range changed');
    fetchData();
  }, [dateRange]);

  // 날짜 범위 변경 핸들러
  const handleStartDateChange = (e) => {
    setDateRange({
      ...dateRange,
      startDate: new Date(e.target.value)
    });
  };

  const handleEndDateChange = (e) => {
    setDateRange({
      ...dateRange,
      endDate: new Date(e.target.value)
    });
  };

  // 수동 데이터 새로고침 핸들러
  const handleRefresh = () => {
    fetchData();
  };

  const toggleMonitoring = () => {
    setShowMonitoring(!showMonitoring);
  };

  // 로딩 상태 또는 에러 처리
  if (isLoading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 총 방문자 계산
  const totalVisitors = visitorStats ? 
    Object.values(visitorStats).reduce((sum, val) => sum + val, 0) : 0;

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">관리자 대시보드</h1>
      
      {/* 날짜 범위 선택 */}
      <div className="date-range-picker">
        <label>기간 선택:</label>
        <input
          type="date"
          value={formatDate(dateRange.startDate)}
          onChange={handleStartDateChange}
        />
        <span> ~ </span>
        <input
          type="date"
          value={formatDate(dateRange.endDate)}
          onChange={handleEndDateChange}
        />
        <button onClick={handleRefresh} className="refresh-button">
          <FaRedoAlt /> 새로고침
        </button>
        <button 
          onClick={toggleMonitoring}
          className="refresh-button ml-4"
        >
          {showMonitoring ? '모니터링 숨기기' : '시스템 모니터링 보기'}
        </button>
      </div>
      
      {error && <div className="admin-error-message">{error}</div>}
      
      {/* 모니터링 섹션 - 탭 인터페이스 */}
      {showMonitoring && (
        <div className="monitoring-section mt-4 mb-8">
          <div className="flex border-b border-gray-200 mb-4">
            <button 
              className={`py-2 px-4 mr-2 ${activeTab === 'spring' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('spring')}
            >
              Spring Boot 모니터링
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'mariadb' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('mariadb')}
            >
              MariaDB 모니터링
            </button>
          </div>
          
          <div className="monitoring-iframe-wrapper" style={{ height: '800px', width: '100%' }}>
            {activeTab === 'spring' ? (
              <iframe
                src="http://13.209.15.189:3000/d/spring_boot_21/spring-boot-2-1-system-monitor?orgId=1&from=now-1h&to=now&refresh=5s&var-instance=port-0-java-springboot-lan-m8dt2pjh3adde56e.sel4.cloudtype.app&var-hikaricp=HikariPool-1"
                width="100%"
                height="800"
                frameBorder="0"
                title="Spring Boot 모니터링 대시보드"
              ></iframe>
            ) : (
              <iframe
                src="http://13.209.15.189:3000/goto/F8iQxX-Hg?orgId=1"
                width="100%"
                height="800"
                frameBorder="0"
                title="MariaDB 모니터링 대시보드"
              ></iframe>
            )}
          </div>
        </div>
      )}
      
      {/* 통계 카드 섹션 */}
      <div className="stat-cards">
        <StatCard
          title="총 방문자"
          value={totalVisitors}
          icon={<FaUsers />}
          color="#3498db"
        />
        <StatCard
          title="방문 국가 수"
          value={countryStats ? Object.keys(countryStats).length : 0}
          icon={<FaGlobe />}
          color="#2ecc71"
        />
        <StatCard
          title="문의 총계"
          value={inquiryStats.TOTAL || 0}
          icon={<FaTicketAlt />}
          color="#e74c3c"
        />
        <StatCard
          title="해결된 문의"
          value={inquiryStats.RESOLVED || 0}
          icon={<FaCheck />}
          color="#f39c12"
        />
      </div>
      
      {/* 디버깅 정보 표시 (개발 중에만 사용) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ margin: '20px 0', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
          <details>
            <summary>디버깅 정보</summary>
            <div>
              <p>방문자 통계: {JSON.stringify(visitorStats)}</p>
              <p>국가별 통계: {JSON.stringify(countryStats)}</p>
              <p>문의 통계: {JSON.stringify(inquiryStats)}</p>
            </div>
          </details>
        </div>
      )}
      
      {/* 차트 섹션 */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>일별 방문자 통계</h3>
          <VisitorChart data={visitorStats} />
        </div>
        
        <div className="chart-card">
          <h3>국가별 방문자 분포</h3>
          <CountryMap data={countryStats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useRef, useContext, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next'; // i18n import 추가
import '../../WritingTemplate.css';

const WritingTemplate = () => {
  const { t } = useTranslation(); // useTranslation 훅 추가
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [rows, setRows] = useState(5);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = 12;
  const writingAreaRef = useRef(null);
  const defaultSymbol = '';
  const { user } = useContext(AuthContext);

// WritingTemplate.js에서 수정할 부분
useEffect(() => {
  const fetchUserInfo = async () => {
    if (user) {
      try {
        // user.email이 있으면 헤더에 추가
        const headers = {};
        if (user.email) {
          headers['X-User-Email'] = user.email;
        }
        
        const response = await api.get('/api/users/me', { headers });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        
        if (error.response) {
          setError(`Failed to fetch user information: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          setError('Failed to fetch user information: No response from server');
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  fetchUserInfo();
}, [user]);

  const handleDownload = async () => {
    if (!user) {
      alert(t('writing.loginRequired'));
      return;
    }

    if (loading) {
      alert(t('writing.waitLoading'));
      return;
    }

    if (error) {
      alert(t('writing.errorTryAgain'));
      return;
    }

    const usageLimit = userInfo.isPremium ? 100 : 3;
    if (userInfo && userInfo.dailyUsageCount >= usageLimit) {
      alert(t('writing.usageLimitReached', { 
        limit: usageLimit, 
        premium: !userInfo.isPremium ? t('writing.upgradeMessage') : '' 
      }));
      return;
    }

    try {
      await api.post('/api/users/incrementUsage');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxGridsPerPage = 2;

      const totalGrids = Math.max(1, Math.ceil(text.length / columns));
      const totalPages = Math.ceil(totalGrids / maxGridsPerPage);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const pageElement = document.createElement('div');
        pageElement.style.width = `${pageWidth}mm`;
        pageElement.style.height = `${pageHeight}mm`;
        pageElement.style.padding = `${margin}mm`;
        pageElement.style.backgroundColor = '#ffffff';
        document.body.appendChild(pageElement);

        const gridsOnThisPage = Math.min(maxGridsPerPage, totalGrids - page * maxGridsPerPage);

        for (let i = 0; i < gridsOnThisPage; i++) {
          const gridIndex = page * maxGridsPerPage + i;
          const gridElement = renderGrid(gridIndex * columns);
          pageElement.appendChild(gridElement);
        }

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

        document.body.removeChild(pageElement);
      }

      pdf.save('writing-practice.pdf');

      const updatedUserInfo = await api.get('/api/users/me');
      setUserInfo(updatedUserInfo.data);

    } catch (error) {
      console.error('PDF generation error:', error);
      if (error.response && error.response.status === 403) {
        alert(t('writing.usageLimitReached', { limit: 0, premium: '' }));
      } else {
        alert(t('writing.pdfError'));
      }
    }
  };

  const renderGrid = (startIndex) => {
    const gridElement = document.createElement('div');
    gridElement.className = 'grid';
    gridElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    for (let i = 0; i < rows * columns; i++) {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';
      cellElement.style.fontSize = `${fontSize}px`;

      const row = Math.floor(i / columns);
      const col = i % columns;
      const char = text[startIndex + col] || defaultSymbol;

      if (char) {
        const charElement = document.createElement('div');
        charElement.textContent = char;
        charElement.className = row === 0 ? 'bold-text' : 'tracing-text';
        cellElement.appendChild(charElement);
      }

      gridElement.appendChild(cellElement);
    }

    return gridElement;
  };

  const gridsNeeded = Math.max(1, Math.ceil(text.length / columns));

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="writing-template">
      <div className="content-wrapper">
        <h1>{t('writing.title')}</h1>
        {userInfo && (
         <div className="user-info-container">
  <div className="user-info">
    <p className="usage-info">
      <span className="usage-label">{t('writing.dailyUsage')}:</span> 
      <span className="usage-value">{userInfo.dailyUsageCount}/{userInfo.isPremium ? '100' : '3'}</span>
    </p>
    <p className="user-type">
      {userInfo.isPremium ? (
        <span className="premium-badge">{t('chat.premiumUser')}</span>
      ) : (
        <span className="free-badge">{t('chat.freeUser')}</span>
      )}
    </p>
  </div>
</div>
        )}
        <div className="controls">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('writing.enterText')}
            className="text-input"
          />
          <div className="number-inputs">
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="12"
              max="72"
              placeholder={t('writing.fontSize')}
              className="number-input"
            />
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              min="1"
              max="10"
              placeholder={t('writing.rows')}
              className="number-input"
            />
          </div>
          <button 
            onClick={handleDownload} 
            className="download-button"
            disabled={userInfo && userInfo.dailyUsageCount >= (userInfo.isPremium ? 100 : 3)}
          >
            {t('writing.savePDF')}
          </button>
        </div>
        <div ref={writingAreaRef} className="writing-area">
          {[...Array(Math.min(2, gridsNeeded))].map((_, gridIndex) => (
            <div key={gridIndex} className="grid" style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}>
              {[...Array(rows * columns)].map((_, cellIndex) => {
                const row = Math.floor(cellIndex / columns);
                const col = cellIndex % columns;
                const char = text[gridIndex * columns + col] || defaultSymbol;
                return (
                  <div key={cellIndex} className="cell" style={{ fontSize: `${fontSize}px` }}>
                    {char && (
                      <div className={row === 0 ? 'bold-text' : 'tracing-text'}>
                        {char}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WritingTemplate;
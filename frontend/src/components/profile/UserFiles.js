import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import '../../UserFiles.css';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaFileAudio, FaDownload, FaTrash, FaSpinner } from 'react-icons/fa';

const UserFiles = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [conversationFiles, setConversationFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // 로딩 상태 관리
  const [downloadingFiles, setDownloadingFiles] = useState({});
  const [deletingFiles, setDeletingFiles] = useState({});
  
  // 파일 타입별 최대 저장 개수 제한
  const FILE_LIMIT_PER_TYPE = 2;
  
  useEffect(() => {
    fetchFiles();
  }, [activeTab]);
  
  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      // 대화 PDF 파일만 가져오기
      const conversationResponse = await api.get('/api/files', {
        params: { fileType: 'CONVERSATION_PDF' }
      });
      setConversationFiles(conversationResponse.data);
      
      // 모든 오디오 파일 가져오기 (MP3 + SCRIPT_AUDIO)
      const mp3Response = await api.get('/api/files', {
        params: { fileType: 'MP3' }
      });
      const scriptAudioResponse = await api.get('/api/files', {
        params: { fileType: 'SCRIPT_AUDIO' }
      });
      
      // 두 타입의 오디오 파일 합치기
      const allAudioFiles = [...mp3Response.data, ...scriptAudioResponse.data];
      
      // 날짜순 정렬 (최신순)
      allAudioFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAudioFiles(allAudioFiles);
      
      // 모든 파일 또는 현재 선택된 탭에 맞는 파일 설정
      if (activeTab === 'all') {
        setFiles([...conversationResponse.data, ...allAudioFiles]);
      } else if (activeTab === 'conversation') {
        setFiles(conversationResponse.data);
      } else if (activeTab === 'mp3') {
        setFiles(allAudioFiles);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 파일 삭제 함수
  const handleDelete = async (fileId, fileName) => {
    // 사용자에게 삭제 확인 요청
    if (!window.confirm(`${fileName} 파일을 삭제하시겠습니까?`)) {
      return;
    }
    
    try {
      // 삭제 로딩 상태 시작
      setDeletingFiles(prev => ({ ...prev, [fileId]: true }));
      
      const response = await api.delete(`/api/files/${fileId}`);
      
      if (response.data && response.data.status === 'success') {
        // 삭제 성공 시 목록 새로고침
        fetchFiles();
        alert('파일이 성공적으로 삭제되었습니다.');
      } else {
        alert('파일 삭제 실패: ' + (response.data?.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert(t('files.deleteError') || '파일 삭제 중 오류가 발생했습니다.');
    } finally {
      // 삭제 로딩 상태 종료
      setDeletingFiles(prev => ({ ...prev, [fileId]: false }));
    }
  };
  
  // 파일 다운로드 함수
  const handleDownload = async (fileId, fileName) => {
    try {
      // 다운로드 로딩 상태 시작
      setDownloadingFiles(prev => ({ ...prev, [fileId]: true }));
      
      const response = await api.get(`/api/files/download/${fileId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(t('files.downloadError') || '파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      // 다운로드 로딩 상태 종료
      setDownloadingFiles(prev => ({ ...prev, [fileId]: false }));
    }
  };
  
  // 파일 항목 렌더링 함수
  const renderFileItem = (file) => {
    const isPDF = file.fileType === 'CONVERSATION_PDF';
    const isDownloading = downloadingFiles[file.id] || false;
    const isDeleting = deletingFiles[file.id] || false;
    
    return (
      <div key={file.id} className="file-item">
        <div className="file-icon">
          {isPDF ? <FaFilePdf /> : <FaFileAudio />}
        </div>
        <div className="file-info">
          <div className="file-name">{file.fileName}</div>
          <div className="file-date">
            {t('files.createdAt') || '생성일'}: {formatDate(file.createdAt)}
          </div>
          <div className="file-expiry">
            {t('files.expiresAt') || '만료일'}: {formatDate(file.expireAt)}
          </div>
          <div className="file-size">
            {t('files.fileSize') || '파일 크기'}: {formatFileSize(file.fileSize)}
          </div>
        </div>
        <div className="file-actions">
          <button 
            className="file-action-button download"
            onClick={() => handleDownload(file.id, file.fileName)}
            disabled={isDownloading || isDeleting}
          >
            <div className="button-content">
              <div className="icon-container">
                {isDownloading ? (
                  <FaSpinner className="icon spinner" />
                ) : (
                  <FaDownload className="icon" />
                )}
              </div>
              <span>
                {isDownloading ? 
                  (t('common.downloading') || '다운로드중...') : 
                  (t('files.download') || '다운로드')
                }
              </span>
            </div>
          </button>
          <button 
            className="file-action-button delete"
            onClick={() => handleDelete(file.id, file.fileName)}
            disabled={isDownloading || isDeleting}
          >
            <div className="button-content">
              <div className="icon-container">
                {isDeleting ? (
                  <FaSpinner className="icon spinner" />
                ) : (
                  <FaTrash className="icon" />
                )}
              </div>
              <span>
                {isDeleting ? 
                  (t('common.deleting') || '삭제중...') : 
                  (t('files.delete') || '삭제')
                }
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{t('common.loading') || '로딩 중...'}</p>
    </div>
  );
  
  return (
    <div className="user-files-container">
      <h2>{t('files.title') || '내 파일'}</h2>
      
      {/* 파일 타입별 저장 한도 표시 */}
      <div className="file-limits">
        <div className="limit-item">
          <span className="limit-label">대화 PDF:</span>
          <div className="limit-bar">
            <div 
              className="limit-progress" 
              style={{ 
                width: `${Math.min(
                  conversationFiles.length / FILE_LIMIT_PER_TYPE * 100, 
                  100
                )}%` 
              }}
            ></div>
          </div>
          <span className="limit-text">
            {conversationFiles.length}/{FILE_LIMIT_PER_TYPE}
          </span>
        </div>
        
        <div className="limit-item">
          <span className="limit-label">오디오 파일:</span>
          <div className="limit-bar">
            <div 
              className="limit-progress" 
              style={{ 
                width: `${Math.min(
                  audioFiles.length / FILE_LIMIT_PER_TYPE * 100, 
                  100
                )}%` 
              }}
            ></div>
          </div>
          <span className="limit-text">
            {audioFiles.length}/{FILE_LIMIT_PER_TYPE}
          </span>
        </div>
      </div>
      
      <div className="file-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          {t('files.allFiles') || '모든 파일'}
        </button>
        <button 
          className={activeTab === 'conversation' ? 'active' : ''}
          onClick={() => setActiveTab('conversation')}
        >
          {t('files.conversationFiles') || '대화 PDF'}
        </button>
        <button 
          className={activeTab === 'mp3' ? 'active' : ''}
          onClick={() => setActiveTab('mp3')}
        >
          {t('files.audioFiles') || '오디오 파일'}
        </button>
      </div>
      
      {files.length === 0 ? (
        <div className="no-files">{t('files.noFiles') || '저장된 파일이 없습니다.'}</div>
      ) : (
        <div className="files-list">
          {files.map(file => renderFileItem(file))}
        </div>
      )}
      
      <div className="files-info">
        <p>
          {t('files.storageLimitDetailed', { limit: FILE_LIMIT_PER_TYPE }) || 
            `각 유형별로 최대 ${FILE_LIMIT_PER_TYPE}개의 파일만 저장됩니다. 새 파일을 저장하면 가장 오래된 파일이 자동으로 삭제됩니다.`}
        </p>
        <p>{t('files.expiryInfo') || '모든 파일은 생성 후 30일이 지나면 자동으로 삭제됩니다.'}</p>
      </div>
    </div>
  );
};

export default UserFiles;
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaFileAlt, FaDownload, FaTrash, FaPlus } from 'react-icons/fa';
import '../../WritingExercise.css';

const WritingExerciseList = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  
  // 각 버튼에 대한 로딩 상태 관리
  const [loadingDownloadId, setLoadingDownloadId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  useEffect(() => {
    fetchWritingExercises();
  }, []);
  
  const fetchWritingExercises = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/writing-exercises');
      setExercises(response.data);
      setError(null);
    } catch (err) {
      setError(t('writing.fetchError') || '영작 연습 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async (id) => {
    try {
      setLoadingDownloadId(id); // 다운로드 시작 시 로딩 상태 설정
      
      const response = await api.get(`/api/writing-exercises/${id}/download`, {
        responseType: 'blob'
      });
      
      // 파일 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `writing_exercise_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(t('writing.downloadError') || '파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setLoadingDownloadId(null); // 다운로드 완료 시 로딩 상태 해제
    }
  };
  
  const confirmDelete = (exercise) => {
    setExerciseToDelete(exercise);
    setShowDeleteConfirm(true);
  };
  
  const cancelDelete = () => {
    setExerciseToDelete(null);
    setShowDeleteConfirm(false);
  };
  
  const handleDelete = async () => {
    if (!exerciseToDelete) return;
    
    try {
      setLoadingDeleteId(exerciseToDelete.id); // 삭제 시작 시 로딩 상태 설정
      
      await api.delete(`/api/writing-exercises/${exerciseToDelete.id}`);
      setExercises(exercises.filter(ex => ex.id !== exerciseToDelete.id));
      setShowDeleteConfirm(false);
      setExerciseToDelete(null);
    } catch (err) {
      setError(t('writing.deleteError') || '영작 연습 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoadingDeleteId(null); // 삭제 완료 시 로딩 상태 해제
    }
  };
  
  const handleCreateNew = () => {
    setIsCreatingNew(true); // 새 영작 연습 생성 시 로딩 상태 설정
    navigate('/writing-exercises/create');
  };
  
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return t('writing.easy') || '쉬움';
      case 'hard': return t('writing.hard') || '어려움';
      default: return t('writing.medium') || '중간';
    }
  };
  
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // 로딩 스피너 컴포넌트
  const LoadingSpinner = () => (
    <div className="spinner-small"></div>
  );
  
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{t('common.loading') || '로딩 중...'}</p>
      </div>
    );
  }
  
  return (
    <div className="writing-exercises-list">
      <div className="list-header">
        <h1>{t('writing.myExercises') || '내 영작 연습'}</h1>
        <button 
          className="btn btn-primary create-button"
          onClick={handleCreateNew}
          disabled={exercises.length >= 2 || isCreatingNew}
        >
          {isCreatingNew ? (
            <div className="button-content-with-spinner">
              <LoadingSpinner />
              <span>{t('common.loading') || '로딩 중...'}</span>
            </div>
          ) : (
            <>
              <FaPlus /> {t('writing.createNew') || '새 영작 연습'}
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {exercises.length === 0 ? (
        <div className="empty-state">
          <FaFileAlt className="empty-icon" />
          <p>{t('writing.noExercises') || '영작 연습이 없습니다.'}</p>
          <button 
            className="btn btn-primary"
            onClick={handleCreateNew}
            disabled={isCreatingNew}
          >
            {isCreatingNew ? (
              <div className="button-content-with-spinner">
                <LoadingSpinner />
                <span>{t('common.loading') || '로딩 중...'}</span>
              </div>
            ) : (
              t('writing.createFirst') || '첫 영작 연습 만들기'
            )}
          </button>
        </div>
      ) : (
        <div className="exercise-cards">
          {exercises.map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <div className="card-header">
                <FaFileAlt className="card-icon" />
                <h3>{exercise.title}</h3>
              </div>
              <div className="card-content">
                <p><strong>{t('writing.difficulty') || '난이도'}:</strong> {getDifficultyText(exercise.difficulty)}</p>
                <p><strong>{t('writing.questions') || '문제 수'}:</strong> {exercise.exerciseCount}</p>
                <p><strong>{t('writing.createdAt') || '생성일'}:</strong> {getFormattedDate(exercise.createdAt)}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleDownload(exercise.id)}
                  disabled={loadingDownloadId === exercise.id}
                >
                  {loadingDownloadId === exercise.id ? (
                    <div className="button-content-with-spinner">
                      <LoadingSpinner />
                      <span>{t('common.loading') || '로딩 중...'}</span>
                    </div>
                  ) : (
                    <>
                      <FaDownload /> {t('writing.download') || '다운로드'}
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => confirmDelete(exercise)}
                >
                  <FaTrash /> {t('common.delete') || '삭제'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showDeleteConfirm && exerciseToDelete && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h3>{t('writing.deleteConfirmTitle') || '영작 연습 삭제'}</h3>
            <p>
              {t('writing.deleteConfirmMessage', { title: exerciseToDelete.title }) || 
               `"${exerciseToDelete.title}" 영작 연습을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
            </p>
            <div className="confirm-buttons">
              <button 
                onClick={cancelDelete} 
                className="btn btn-secondary"
                disabled={loadingDeleteId === exerciseToDelete.id}
              >
                {t('common.cancel') || '취소'}
              </button>
              <button 
                onClick={handleDelete} 
                className="btn btn-danger"
                disabled={loadingDeleteId === exerciseToDelete.id}
              >
                {loadingDeleteId === exerciseToDelete.id ? (
                  <div className="button-content-with-spinner">
                    <LoadingSpinner />
                    <span>{t('common.loading') || '로딩 중...'}</span>
                  </div>
                ) : (
                  t('common.delete') || '삭제'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {exercises.length >= 2 && (
        <div className="info-message">
          <p>{t('writing.maxExercisesReached') || '최대 2개의 영작 연습만 저장할 수 있습니다. 새 영작 연습을 생성하려면 기존 영작 연습을 삭제해주세요.'}</p>
        </div>
      )}
    </div>
  );
};

export default WritingExerciseList;
import React, {useEffect, useState} from 'react';
import './PerfumeMain.css';
import {Link, useNavigate} from 'react-router-dom';
import CheckModal from '../components/CheckModal';
import LogoutButton from '../components/Logout';
import {apiClient} from '../api/client';
import CursorTrail from '../components/CursorTrail';

const PerfumeMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 8;
  const [message, setMessage] = useState('');
  const [likes, setLikes] = useState({}); // 좋아요 상태 관리

  // 로그인 상태 확인
  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    setIsLoggedIn(!!accessToken);
  }, []);

  // 모달 메시지 표시
  const showMessage = (msg) => {
    setModalMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 리뷰 작성 페이지로 이동
  const handleReviewButtonClick = () => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      showMessage('로그인이 필요합니다.');
    } else {
      navigate('/perfumeWrite');
    }
  };

  const handleLikeToggle = async (reviewId, isLiked) => {
    try {
      if (isLiked) {
        // 좋아요 취소
        await apiClient.delete(`/api/reviews/${reviewId}/likes`);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [reviewId]: (prevLikes[reviewId] || 1) - 1,
        }));
      } else {
        // 좋아요 추가
        await apiClient.post(`/api/reviews/${reviewId}/likes`);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [reviewId]: (prevLikes[reviewId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error.response || error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // API 호출로 리뷰 데이터 가져오기
  const fetchReviews = async () => {
    try {
      const response = await apiClient.get('/api/reviews');
      const fetchedReviews = response.data.data;

      setReviews(fetchedReviews);
      setTotalPages(Math.ceil(fetchedReviews.length / recordsPerPage));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews(); // 컴포넌트 마운트 시 리뷰 데이터 가져오기
  }, []);

  // 좋아요 버튼 클릭 처리
  const handleLikeClick = (event) => {
    const button = event.currentTarget;
    const countElement = button.querySelector('.like-count');
    const isLiked = button.classList.toggle('liked');
    const count = parseInt(countElement.textContent, 10);

    countElement.textContent = isLiked ? count + 1 : count - 1;
  };

  const handleLoginClick = (e) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      setMessage('이미 로그인이 되어있습니다');
      setIsModalOpen(true);
      e.preventDefault(); // 로그인 페이지로 이동 방지
    } else {
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

  // 현재 페이지에 해당하는 리뷰만 가져오기
  const getPaginatedReviews = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return reviews.slice(startIndex, endIndex);
  };

  return (
      <div className="main">
        <CursorTrail/>
        <header className="header">
          <div className="header-left">
            <svg className="logo" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2c2c2c"
                      strokeWidth="2"/>
              <path d="M30,50 Q50,20 70,50 Q50,80 30,50" fill="none"
                    stroke="#2c2c2c" strokeWidth="2"/>
              <circle cx="50" cy="50" r="5" fill="#2c2c2c"/>
            </svg>
            <Link to="/" className="nab-button">
              <h1>EsSeNTIA</h1>
            </Link>
          </div>

          <div className="header-right">
            <Link to="/perfumeMain" className="nav-button">
              Review
            </Link>
            {!isLoggedIn && (
                <Link to="/login" className="nav-button"
                      onClick={handleLoginClick}>
                  Login
                </Link>
            )}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
            {!isLoggedIn && (
                <Link to="/login" className="nav-button"
                      onClick={handleLoginClick}>
                  MyPage
                </Link>
            )}
            {isLoggedIn && (
                <Link to="/my-page" className="nav-button">
                  MyPage
                </Link>
            )}
          </div>
        </header>
        <section className="gradient-transition2">
          <div className="gradient-overlay"></div>
          <div className="pm-section">당신의 향을 공유해주세요</div>
          <svg
              className="pm-indicator"
              width="40"
              height="40"
              viewBox="0 0 24 24"
          >
            <path
                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                fill="white"
            />
          </svg>
        </section>

        <section className="pm-hero">
          <button className="review-button" onClick={handleReviewButtonClick}>
            향수 소개하기
          </button>
        </section>

        <div className="review-grid">
          {getPaginatedReviews().map((review) => {
            const isLiked = likes[review.id] > 0;
            return (
                <div
                    key={review.id}
                    className="review-card"
                    onClick={() => navigate(`/PerfumeDetail/${review.id}`)}
                >
                  <div className="review-image">
                    {review.reviewImageUrl ? (
                        <img src={review.reviewImageUrl} alt={review.title}/>
                    ) : (
                        <div className="placeholder-image"></div>
                    )}
                  </div>
                  <div className="review-info">
                    <div className="review-left">
                      <h3>{review.title}</h3>
                      <span
                          className="fragrance-family">{review.fragranceType}</span>
                      <span className="author">작성자: {review.username}</span>
                    </div>
                    <div className="review-right">
                      <button
                          className={`like-button ${isLiked ? 'liked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation(); // 카드 클릭 방지
                            handleLikeToggle(review.id, isLiked);
                          }}
                      >
                        <svg className="heart-icon" viewBox="0 0 24 24">
                          <path
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          />
                        </svg>
                        <span className="like-count">{likes[review.id]
                            || 0}</span>
                      </button>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>

        {/* 페이지네이션 버튼 */}
        <div className="pagination-buttons">
          <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
            이전
          </button>
          <button onClick={() => setCurrentPage(
              (prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}>
            다음
          </button>
        </div>
        {isModalOpen && <CheckModal message={modalMessage}
                                    onClose={handleCloseModal}/>}
      </div>
  );
};

export default PerfumeMain;
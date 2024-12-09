import React, {useEffect, useState} from 'react';
import './PerfumeWrite.css';
import {apiClient} from "../api/client";
import {Link, useNavigate} from 'react-router-dom';
import LogoutButton from '../components/Logout';
import CheckModal from '../components/CheckModal';
import CursorTrail from '../components/CursorTrail';

const PerfumeWrite = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [fragranceType, setFragranceType] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      showMessage('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const formData = new FormData();

    // JSON 데이터를 FormData의 문자열로 추가
    const jsonRequestDto = JSON.stringify({
      title,
      fragranceType,
      content,
      tags: tags.split(' ').map((tag) => tag.trim()), // 태그를 배열로 변환
    });
    formData.append('requestDto',
        new Blob([jsonRequestDto], {type: 'application/json'}));

    // 이미지 추가
    if (file) {
      formData.append('reviewImage', file);
    }

    try {
      // apiClient로 POST 요청
      const response = await apiClient.post('/api/reviews', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // FormData 전송에 적합한 Content-Type
        },
      });

      if (response.status === 201) {
        alert('리뷰가 성공적으로 등록되었습니다!');
        navigate('/PerfumeMain');
      } else {
        showMessage('리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 저장 오류:', error);
      showMessage('서버와의 통신 중 문제가 발생했습니다.');
    }
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
            <Link to="/perfumeMain" className="nav-button2">
              Review
            </Link>
            {!isLoggedIn && (
                <Link to="/login" className="nav-button2"
                      onClick={handleLoginClick}>
                  Login
                </Link>
            )}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
            {!isLoggedIn && (
                <Link to="/login" className="nav-button2"
                      onClick={handleLoginClick}>
                  MyPage
                </Link>
            )}
            {isLoggedIn && (
                <Link to="/my-page" className="nav-button2">
                  MyPage
                </Link>
            )}
          </div>
        </header>

        <section className="review-hero">
          <div className="review-form-container">
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="review-title">제목</label>
                <input type="text" id="review-title"
                       placeholder="리뷰 제목을 입력하세요"
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       required/>
              </div>

              <div className="form-group">
                <label htmlFor="fragrance-type">향 종류</label>
                <select id="fragrance-type" value={fragranceType}
                        onChange={(e) => setFragranceType(e.target.value)}
                        required>
                  <option value="">향의 종류를 선택하세요</option>
                  <option value="시트러스">시트러스</option>
                  <option value="플로럴">플로럴</option>
                  <option value="우디">우디</option>
                  <option value="오리엔탈">오리엔탈</option>
                  <option value="프레시">프레시</option>
                  <option value="구르망">구르망</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="review-content">리뷰 내용</label>
                <textarea id="review-content" rows="10"
                          placeholder="향수에 대한 리뷰를 작성해주세요" value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="review-tags">태그</label>
                <input type="text" id="review-tags"
                       placeholder="#태그1 #태그2 형식으로 입력하세요" value={tags}
                       onChange={(e) => setTags(e.target.value)}/>
              </div>

              <div className="form-group">
                <label htmlFor="review-image">이미지 첨부</label>
                <div className="file-upload">
                  <input type="file" id="review-image" accept="image/*"
                         onChange={handleImageChange}/>
                  {filePreview && (
                      <div className="file-preview">
                        <img src={filePreview} alt="Preview"/>
                      </div>
                  )}
                </div>
              </div>

              <button type="submit" className="review-submit-button">리뷰 등록하기
              </button>
            </form>
          </div>
        </section>

        {isModalOpen && <CheckModal message={message}
                                    onClose={handleCloseModal}/>}
      </div>
  );
};

export default PerfumeWrite;

import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './PerfumeDetail.css';
import {apiClient} from "../api/client";
import {Link, useNavigate} from 'react-router-dom';
import CheckModal from '../components/CheckModal';
import LogoutButton from '../components/Logout';
import CursorTrail from '../components/CursorTrail';

const PerfumeDetail = () => {
  const {reviewId} = useParams();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});
  const [replyForms, setReplyForms] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedReview, setEditedReview] = useState({});
  const scentOptions = ["Floral", "Woody", "Citrus", "Oriental", "Fruity",
    "Fresh"];

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {  // 로그인 상태 체크
      setIsLoggedIn(true); // 로그인 상태로 설정
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

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setEditedReview((prev) => ({...prev, [name]: value}));
  };

  const handleScentChange = (e) => {
    const {value} = e.target;
    setEditedReview((prev) => ({...prev, fragranceType: value}));
  };

  const handleCancelEdit = () => {
    setEditedReview(review);
    setIsEditMode(false);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();

      const json = JSON.stringify({
        title: editedReview.title || "",
        content: editedReview.content || "",
        tags: editedReview.tags || [],
        fragranceType: editedReview.fragranceType || "",
      });
      formData.append("requestDto",
          new Blob([json], {type: "application/json"}));

      if (editedReview.reviewImageFile) {
        formData.append("reviewImage", editedReview.reviewImageFile);
      }

      const response = await apiClient.put(`/api/reviews/${reviewId}`, formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      setReview(response.data.data);
      setIsEditMode(false);
      showMessage("수정이 완료되었습니다!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("수정 저장 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await apiClient.get(`/api/reviews/${reviewId}`);
        if (response.status === 200) {
          setReview(response.data.data);
        } else {
          console.error(`Unexpected response: ${response.status}`);
          alert('리뷰 데이터를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(`Review not found: ${reviewId}`);
          alert('리뷰를 찾을 수 없습니다. 잘못된 요청입니다.');
        } else {
          console.error('Error fetching review:', error);
          alert('서버와 통신 중 오류가 발생했습니다.');
        }
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(
            `/api/reviews/${reviewId}/comments`);
        setComments(response.data.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchReview();
    fetchComments();
  }, [reviewId]);

  const handleReplyToggle = (index) => {
    setReplyForms((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLikeToggle = async (commentId, isLiked, comment) => {
    try {
      const currentLikes = likes[commentId] || comment.likes || 0;
      if (isLiked) {
        // Unlike the comment
        await apiClient.delete(
            `/api/reviews/${reviewId}/comments/${commentId}/likes`);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: currentLikes - 1,
        }));
      } else {
        // Like the comment
        await apiClient.post(
            `/api/reviews/${reviewId}/comments/${commentId}/likes`);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: currentLikes + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error.response || error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await apiClient.delete(
            `/api/reviews/${reviewId}/comments/${commentId}`);
        setComments((prevComments) => prevComments.filter(
            (comment) => comment.id !== commentId));
        alert('댓글이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting comment:', error.response || error);
        alert(`댓글 삭제 중 오류 발생: ${error.response?.data?.message || '알 수 없는 오류'}`);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedReview((prev) => ({
          ...prev,
          reviewImageFile: file,
          reviewImageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e, parentId = null) => {
    e.preventDefault();
    const textarea = e.target.querySelector('textarea');
    const content = textarea.value.trim();

    if (!content) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      console.log('Submitting comment with content:', content, 'and parentId:',
          parentId);

      if (parentId) {
        await apiClient.post(
            `/api/reviews/${reviewId}/comments/${parentId}/replies`,
            {content}
        );
      } else {
        await apiClient.post(`/api/reviews/${reviewId}/comments`, {content});
      }

      textarea.value = '';
      alert('댓글이 등록되었습니다!');

      // Refresh comments
      const response = await apiClient.get(`/api/reviews/${reviewId}/comments`);
      setComments(response.data.data);
    } catch (error) {
      console.error('Error submitting comment:', error.response || error);
      alert(`댓글 등록 중 오류 발생: ${error.response?.data?.message || '알 수 없는 오류'}`);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      try {
        await apiClient.delete(`/api/reviews/${reviewId}`);
        alert('게시글이 성공적으로 삭제되었습니다.');
        navigate('/perfumeMain');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('게시글을 삭제에 실패했습니다.');
      }
    }
  };

  if (!review) {
    return <div>Loading...</div>;
  }

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

        <div className="post-container">
          {isEditMode ? (
              <div className="post-header">
                <input
                    type="text"
                    name="title"
                    value={editedReview.title || ""}
                    onChange={handleInputChange}
                    className="post-title edit-input"
                />
                <div className="post-meta">
                  <span>작성자: {review.username}</span>
                  <select
                      name="fragranceType"
                      value={editedReview.fragranceType || ""}
                      onChange={handleScentChange}
                      className="edit-input"
                  >
                    <option value="" disabled>
                      Select a scent
                    </option>
                    {scentOptions.map((scent) => (
                        <option key={scent} value={scent}>
                          {scent}
                        </option>
                    ))}
                  </select>
                  <span>{new Date(review.createdAt).toLocaleString()}</span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="edit-input"
                />
                {editedReview.reviewImageUrl && (
                    <img
                        src={editedReview.reviewImageUrl}
                        alt="Preview"
                        className="post-image preview"
                    />
                )}
                <textarea
                    name="content"
                    value={editedReview.content || ""}
                    onChange={handleInputChange}
                    className="post-content edit-input"
                ></textarea>
                <input
                    type="text"
                    name="tags"
                    value={editedReview.tags?.join(", ") || ""}
                    onChange={(e) =>
                        setEditedReview({
                          ...editedReview,
                          tags: e.target.value.split(",").map(
                              (tag) => tag.trim()),
                        })
                    }
                    className="post-tags edit-input"
                />
                <div className="edit-controls">
                  <button className="save-button" onClick={handleSaveChanges}>
                    저장하기
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    취소하기
                  </button>
                </div>
              </div>
          ) : (
              <div>
                <h1 className="post-title">{review.title}</h1>
                <div className="post-meta">
                  <span>작성자: {review.username}</span>
                  <span>{review.fragranceType}</span>
                  <span>{new Date(review.createdAt).toLocaleString()}</span>
                </div>
                <img
                    src={review.reviewImageUrl
                        || "https://via.placeholder.com/800x400"}
                    alt="Review"
                    className="post-image"
                />
                <div className="post-content">{review.content}</div>
                <div className="post-tags">
                  {review.tags.map((tag, idx) => (
                      <span className="tag" key={idx}>
                  #{tag}
                </span>
                  ))}
                </div>
                <div className="post-actions">
                  <button className="edit-button" onClick={toggleEditMode}>
                    수정하기
                  </button>
                  <button className="delete-button" onClick={handleDeletePost}>
                    삭제하기
                  </button>
                </div>
              </div>
          )}

          <section className="comments-section">
            <h2>댓글</h2>
            <form className="comment-form"
                  onSubmit={(e) => handleFormSubmit(e)}>
            <textarea
                className="comment-input"
                placeholder="댓글을 작성해주세요..."
                rows="3"
            ></textarea>
              <button type="submit" className="edit-button">
                댓글 작성
              </button>
            </form>
            <div className="comments-list">
              {comments.map((comment, index) => (
                  <div className="comment" id={`comment-${comment.id}`}
                       key={comment.id}>
                    <div className="comment-header">
                      <span
                          className="comment-author"> {comment.username} {comment.isAuthor
                          ? '(작성자)' : ''}</span>
                      <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-actions">
                      <button
                          className="comment-button like-button"
                          onClick={() =>
                              handleLikeToggle(
                                  comment.id,
                                  !!likes[comment.id],
                                  comment // Pass the full comment object
                              )
                          }
                      >
                        ♥ {likes[comment.id] || comment.likes || 0}
                      </button>
                      <button
                          className="comment-button reply-button"
                          onClick={() => handleReplyToggle(index)}
                      >
                        답글
                      </button>
                      <button
                          className="comment-button delete-comment"
                          onClick={() => handleDeleteComment(comment.id)}
                      >
                        삭제
                      </button>
                    </div>
                    <form
                        className="reply-form"
                        id={`reply-form-${index}`}
                        style={{display: replyForms[index] ? 'block' : 'none'}}
                        onSubmit={(e) => handleFormSubmit(e, comment.id)}
                    >
                  <textarea
                      className="comment-input"
                      placeholder="답글을 작성해주세요..."
                      rows="2"
                  ></textarea>
                      <button type="submit" className="edit-button">
                        답글 작성
                      </button>
                    </form>
                  </div>
              ))}
            </div>
          </section>
        </div>
        {
            isModalOpen && <CheckModal message={message}
                                       onClose={handleCloseModal}/>
        }
      </div>
  )
      ;
};

export default PerfumeDetail;
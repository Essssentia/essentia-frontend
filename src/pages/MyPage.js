import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './MyPage.css';
import {Link} from 'react-router-dom';
import CheckModal from '../components/CheckModal';
import LogoutButton from '../components/Logout';
import {apiClient} from '../api/client';
import CursorTrail from '../components/CursorTrail';

const MyPage = () => {
  const [bio, setBio] = useState();
  const [profileImage, setProfileImage] = useState(
      'https://via.placeholder.com/200');
  const [profile, setProfile] = useState({username: ''});
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    setIsLoggedIn(!!accessToken);
    fetchProfile();
    fetchUserReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await apiClient.get(`/api/profiles/${userId}`);
      const { username, bio, profileImageUrl } = response.data.data;

      setProfile({
        username: username,
      });
      setBio(bio || 'Welcome to your profile!'); // Ensure default value if bio is null
      setProfileImage(profileImageUrl || 'https://via.placeholder.com/200');
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('Failed to retrieve profile information.');
    }
  };

  const fetchUserReviews = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await apiClient.get(`/api/reviews/users/${userId}`);
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const showMessage = (msg) => {
    setModalMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBioEdit = async () => {
    const newBio = prompt('프로필을 수정하세요:', bio); // Prompt the user for a new bio
    if (newBio !== null) {
      const formData = new FormData();
      formData.append('bio', newBio); // Append new bio to the form data

      try {
        const response = await apiClient.put('/api/profiles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure correct headers
          },
        });

        // Update the bio in the state after a successful API call
        setBio(response.data.data.bio || newBio);
        showMessage('프로필이 성공적으로 업데이트되었습니다.');
      } catch (error) {
        console.error('Error updating bio:', error.response || error);
        showMessage('프로필을 업데이트하는 데 실패했습니다.');
      }
    }
  };

  const handleProfileImageEdit = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('profileImage', file);
        formData.append('bio', bio);

        try {
          const response = await apiClient.put('/api/profiles', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setProfileImage(response.data.data.profileImageUrl);
          showMessage('프로필 이미지가 성공적으로 업데이트되었습니다.');
        } catch (error) {
          console.error('Error updating profile image:',
              error.response || error);
          showMessage('프로필 이미지를 업데이트하는 데 실패했습니다.');
        }
      }
    };
    input.click();
  };

  const handlePostClick = (postId) => {
    navigate(`/PerfumeDetail/${postId}`);
  };

  const handleProfileImageReset = async () => {
    try {
      const formData = new FormData();
      formData.append('bio', bio); // Preserve current bio
      formData.append('profileImage', null); // Reset profile image

      const response = await apiClient.put('/api/profiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileImage('https://via.placeholder.com/200'); // Reset to default image
      showMessage('프로필 이미지가 초기화되었습니다.');
    } catch (error) {
      console.error('Error resetting profile image:', error.response || error);
      showMessage('프로필 이미지를 초기화하는 데 실패했습니다.');
    }
  };

  const handleLikeToggle = async (reviewId, isLiked) => {
    try {
      if (isLiked) {
        await apiClient.delete(`/api/reviews/${reviewId}/likes`);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [reviewId]: (prevLikes[reviewId] || 1) - 1,
        }));
      } else {
        await apiClient.post(`/api/reviews/${reviewId}/likes`);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [reviewId]: (prevLikes[reviewId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      showMessage('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  return (
      <div className="main">
        <CursorTrail/>
        <header className="header">
          <div className="header-left">
            <svg className="logo" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#4a3f35"
                      strokeWidth="2"/>
              <path d="M30,50 Q50,20 70,50 Q50,80 30,50" fill="none"
                    stroke="#4a3f35" strokeWidth="2"/>
              <circle cx="50" cy="50" r="5" fill="#4a3f35"/>
            </svg>
            <Link to="/" className="nav-button">
              <h1>EsSeNTIA</h1>
            </Link>
          </div>
          <div className="header-right">
            <Link to="/perfumeMain" className="nav-button">
              Review
            </Link>
            {!isLoggedIn && (
                <Link to="/login" className="nav-button">
                  Login
                </Link>
            )}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
            {isLoggedIn && (
                <Link to="/my-page" className="nav-button">
                  MyPage
                </Link>
            )}
          </div>
        </header>
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-image-container">
              <img src={profileImage} alt="Profile" className="profile-image"/>
              <button className="edit-profile-image"
                      onClick={handleProfileImageEdit}>
                📷
              </button>
              <button className="reset-profile-image"
                      onClick={handleProfileImageReset}>
                초기화
              </button>
            </div>
            <div className="profile-info">
              <h3 className="username">🙂 {profile.username}</h3>
              <p className="bio">{bio}</p>
              <button className="edit-bio" onClick={handleBioEdit}>소개 수정
              </button>
            </div>
          </div>
          <div className="posts-section">
            <h2>나의 향수 리뷰</h2>
            <div className="posts-grid">
              {posts.map((post) => {
                const isLiked = likes[post.id] > 0;
                return (
                    <div
                        key={post.id}
                        className="post-card"
                        onClick={() => handlePostClick(post.id)}
                    >
                      <img
                          src={post.reviewImageUrl
                              || 'https://via.placeholder.com/300x200'}
                          alt={post.title}
                          className="post-card-image"
                      />
                      <div className="post-card-content">
                        <h3 className="post-card-title">{post.title}</h3>
                        <div className="post-card-meta">
                          <span>{post.fragranceType}</span>
                          <span>{new Date(
                              post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                            className={`like-button ${isLiked ? 'liked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(post.id, isLiked);
                            }}
                        >
                          ♥ {likes[post.id] || post.likes || 0}
                        </button>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
          {isModalOpen && <CheckModal message={modalMessage}
                                      onClose={handleCloseModal}/>}
        </div>
      </div>
  );
};

export default MyPage;

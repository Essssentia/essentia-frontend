import React, {useEffect, useState} from 'react';
import './Main.css';
import {Link, useNavigate} from 'react-router-dom';
import CheckModal from '../components/CheckModal';
import LogoutButton from '../components/Logout';

const modalContent = {
  citrus: {
    title: '시트러스 향수 🍊',
    description: `
            <p>시트러스 향수는 밝고 상큼하며 활기찬 특성을 가지고 있습니다. 주요 노트들:</p>
            <ul>
                <li>🍋 베르가못 - 달콤하고 꽃 향이 나며 약간의 스파이시함</li>
                <li>🍊 오렌지 - 달콤하고 즙이 많으며 따뜻한 향</li>
                <li>🌿 레몬그라스 - 신선하고 깨끗하며 생기 넘치는 향</li>
                <li>🍈 자몽 - 쌉쌀하고 날카로우며 상쾌한 향</li>
            </ul>
            <p>✨ 추천 용도: 아침 시간, 여름철, 그리고 활력이 필요할 때</p>
        `
  },
  floral: {
    title: '플로럴 향수 🌸',
    description: `
            <p>꽃의 우아함을 담은 플로럴 향수의 주요 노트:</p>
            <ul>
                <li>🌹 장미 - 클래식하고 우아한 향</li>
                <li>🌺 자스민 - 관능적이고 달콤한 향</li>
                <li>💐 프리지아 - 순수하고 청초한 향</li>
                <li>🌷 튤립 - 신선하고 봄기운 가득한 향</li>
            </ul>
            <p>✨ 특별한 날이나 로맨틱한 저녁에 완벽한 선택</p>
        `
  },
  oriental: {
    title: '오리엔탈 향수 🌌',
    description: `
            <p>오리엔탈 향수의 매혹적인 주요 노트:</p>
            <ul>
                <li>🌶️ 향신료 - 신비롭고 따뜻한 느낌을 주는 향</li>
                <li>🍨 바닐라 - 달콤하고 부드러운 베이스</li>
                <li>🌳 레진 - 깊이와 풍부함을 더하는 향</li>
            </ul>
            <p>✨ 차분한 저녁이나 특별한 순간에 적합합니다.</p>
        `
  },
  woody: {
    title: '우디 향수 🌲',
    description: `
            <p>자연의 고요함을 담은 우디 향수의 주요 노트:</p>
            <ul>
                <li>🌲 시더우드 - 깊고 풍부한 나무 향</li>
                <li>🌾 샌달우드 - 부드럽고 따뜻한 느낌</li>
                <li>🍃 파출리 - 대지의 느낌을 강조하는 향</li>
            </ul>
            <p>✨ 자연을 사랑하는 분들에게 추천합니다.</p>
        `
  },
  fresh: {
    title: '프레시 향수 🌊',
    description: `
            <p>프레시 향수의 주요 노트:</p>
            <ul>
                <li>💧 바다 - 시원하고 청량한 느낌</li>
                <li>🌿 허브 - 신선하고 자연적인 향</li>
                <li>🍃 레몬 - 상큼하고 생기 넘치는 향</li>
            </ul>
            <p>✨ 여름철이나 활동적인 날에 적합합니다.</p>
        `
  },
  gourmand: {
    title: '구르망 향수 🍰',
    description: `
            <p>구르망 향수의 주요 노트:</p>
            <ul>
                <li>🍦 바닐라 - 달콤하고 부드러운 향</li>
                <li>🍫 초콜릿 - 풍부하고 리치한 맛을 주는 향</li>
                <li>🍬 캐러멜 - 달콤하고 포근한 느낌</li>
            </ul>
            <p>✨ 디저트를 좋아하는 분들에게 추천합니다.</p>
        `
  },
};

const createFloatingParticles = () => {
  return Array.from({length: 50}, (_, i) => ({
    id: i,
    size: Math.random() * 10,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 10 + 15,
  }));
};

const PerfumeCategory = ({type, title, description, onClick, iconPath}) => (
    <div className="perfume-category" data-type={type}
         onClick={() => onClick(type)}>
      <svg className="note-icon" viewBox="0 0 24 24">
        <path d={iconPath} fill="#2c2c2c"/>
      </svg>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
);

const Modal = ({isOpen, onClose, title, description, type}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setParticles(
          Array.from({length: 20}, () => ({
            left: Math.random() * 100,
            fontSize: Math.random() * 20 + 10,
            delay: Math.random() * 5,
            duration: Math.random() * 5 + 8,
          }))
      );
    } else {
      setParticles([]);
    }
  }, [isOpen, type]);

  if (!isOpen) {
    return null;
  }

  return (
      <div className="modal">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>&times;</button>
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{__html: description}}/>
          <div className="modal-bg-particles">
            {particles.map((p, index) => (
                <div
                    key={index}
                    className="modal-particle"
                    style={{
                      left: `${p.left}%`,
                      fontSize: `${p.fontSize}px`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                    }}
                >
                  {p.icon}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [setIsModalOpen, setMessage] = useState('');
  const navigate = useNavigate();

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

  const [particles, setParticles] = useState([]);
  const [modalData, setModalData] = useState(
      {isOpen: false, title: '', description: '', type: ''});

  useEffect(() => {
    setParticles(createFloatingParticles());
  }, []);

  const openModal = (type) => {
    const content = modalContent[type] || {title: '', description: ''};
    setModalData({
      isOpen: true,
      title: content.title,
      description: content.description,
      type
    });
  };

  const closeModal = () => {
    setModalData({isOpen: false, title: '', description: '', type: ''});
  };

  return (
      <div className="main">
        <header className="header">
          <div className="header-left">
            <svg className="logo" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2c2c2c"
                      stroke-width="2"/>
              <path d="M30,50 Q50,20 70,50 Q50,80 30,50" fill="none"
                    stroke="#2c2c2c" stroke-width="2"/>
              <circle cx="50" cy="50" r="5" fill="#2c2c2c"/>
            </svg>
            <h1>EsSeNTIA</h1>
          </div>
          <div className="header-right">
            <button className="nav-button">Review</button>
            {!isLoggedIn && <Link to="/login" className="nav-button" onClick={handleLoginClick}>로그인</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
            {!isLoggedIn && <Link to="/login" className="nav-button" onClick={handleLoginClick}>마이페이지</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>마이페이지</Link>}
          </div>
        </header>

        <section className="hero-section">
          <video
              className="background-video"
              autoPlay
              muted
              loop
              playsInline
          >
            <source
                src="https://cdn.pixabay.com/video/2021/08/04/83880-585600454_large.mp4 "
                type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
          <div className="floating-particles">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      left: `${p.left}%`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                    }}
                ></div>
            ))}
          </div>
          <h1 className="hero-title">EsSeNTIA</h1>
          <svg
              className="scroll-indicator"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              onClick={() => {
                const target = document.getElementById('perfume-grid');
                if (target) {
                  target.scrollIntoView({behavior: 'smooth'});
                }
              }}
          >
            <path
                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                fill="white"
            />
          </svg>
        </section>

        <div id="perfume-grid" className="perfume-grid">
          <PerfumeCategory
              type="citrus"
              title="시트러스"
              description="활기찬 에너지가 가득한 시트러스 향은 상큼한 과일향의 정수를 담고 있습니다."
              iconPath="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20c4.42,0,8-3.58,8-8h3l-4-4L11,12h3A6,6,0,0,1,8,18a2.37,2.37,0,0,1-.6-.08L9.62,14A3,3,0,0,0,11,14c1.66,0,3-1.34,3-3H12l2-2H17z"
              onClick={openModal}
          />
          <PerfumeCategory
              type="floral"
              title="플로럴"
              description="우아한 꽃들의 향연을 담은 플로럴 향은 자연의 아름다움을 담고 있습니다."
              iconPath="M12,1C8.13,1,5,4.13,5,8c0,5,7,13,7,13s7-8,7-13C19,4.13,15.87,1,12,1z M12,11c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,11,12,11z"
              onClick={openModal}
          />
          <PerfumeCategory
              type="oriental"
              title="오리엔탈"
              description="우아한 꽃들의 향연을 담은 플로럴 향은 자연의 아름다움을 담고 있습니다."
              iconPath="M19,12c0,3.57-2.49,6.56-5.83,7.32L12,22l-1.17-2.68C7.49,18.56,5,15.57,5,12c0-4.41,3.59-8,8-8S19,7.59,19,12z M12,15c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3S10.34,15,12,15z"
              onClick={openModal}
          />
          <PerfumeCategory
              type="woody"
              title="우디"
              description="우아한 꽃들의 향연을 담은 플로럴 향은 자연의 아름다움을 담고 있습니다."
              iconPath="M14,6l-1-2H5v17h2v-7h5l1,2h7V6H14z M18,14h-4l-1-2H7V6h5l1,2h5V14z"
              onClick={openModal}
          />
          <PerfumeCategory
              type="fresh"
              title="프레시"
              description="우아한 꽃들의 향연을 담은 플로럴 향은 자연의 아름다움을 담고 있습니다."
              iconPath="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"
              onClick={openModal}
          />
          <PerfumeCategory
              type="gourmand"
              title="구르망"
              description="우아한 꽃들의 향연을 담은 플로럴 향은 자연의 아름다움을 담고 있습니다."
              iconPath="M18.06,3H5.94C4.87,3,4,3.87,4,4.94v14.12C4,20.13,4.87,21,5.94,21h12.12c1.07,0,1.94-0.87,1.94-1.94V4.94C20,3.87,19.13,3,18.06,3z M12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S15.31,18,12,18z"
              onClick={openModal}
          />
        </div>

        <Modal
            isOpen={modalData.isOpen}
            onClose={closeModal}
            title={modalData.title}
            description={modalData.description}
            type={modalData.type}
        />
      </div>
  );
};

export default Main;

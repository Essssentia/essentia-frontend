import React, {useState} from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthPage.css';
import CursorTrail from '../../components/CursorTrail';

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage('');
  };

  return (
      <div className="co-main">
        <CursorTrail/>
        <div className="auth-container">
          {isMessageVisible && <div className="message-modal">{message}</div>}

          <div className={`auth-box ${isLoginMode ? 'login-mode'
              : 'signup-mode'}`}>
            <div className="form-container">
              {isLoginMode ? (
                  <LoginForm
                      toggleMode={toggleMode}
                      setMessage={setMessage}
                      setIsMessageVisible={setIsMessageVisible}
                  />
              ) : (
                  <SignupForm
                      toggleMode={toggleMode}
                      setMessage={setMessage}
                      setIsMessageVisible={setIsMessageVisible}
                  />
              )}
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel">
                  <h2>{isLoginMode ? '환영합니다!' : '안녕하세요!'}</h2>
                  <p>
                    {isLoginMode
                        ? '📮 개인 정보를 사용하여 로그인하세요'
                        : '📮 개인 정보를 입력하고 향기로 가득한 여정을 시작하세요!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default AuthPage;
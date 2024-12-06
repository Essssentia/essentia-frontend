import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import Main from './pages/Main';
// import MyPage from './pages/MyPage';
// import WasteRecord from './pages/PerfumeRecord';
// import WasteRecordWrite from './pages/PerfumeRecordWrite';
// import WasteRecordDetail from './pages/PerfumeRecordDetail';
import GoogleCallback from "./pages/auth/GoogleCallback";

function App() {
  return (
        <Router>
          <Routes>
            <Route path="/" element={<Main/>}/>
            {/*<Route path="/my-page" element={<MyPage/>}/>*/}
            {/*<Route path="/perfumeRecord" element={<WasteRecord/>}/>*/}
            {/*<Route path="/perfumeRecordWrite" element={<WasteRecordWrite/>}/>*/}
            {/*<Route path="/perfumeRecord/:recordId"*/}
            {/*       element={<WasteRecordDetail/>}/>*/}
            <Route path="/login"
                   element={<AuthPage/>}/> {/* 로그인 페이지는 /login 경로로 설정 */}
            <Route path="/signup" element={<AuthPage/>}/>
            <Route path="/google/callback" element={<GoogleCallback/>}/>
          </Routes>
        </Router>
  );
}

export default App;

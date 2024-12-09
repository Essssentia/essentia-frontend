// commentApi.js
import axios from 'axios';

// 기본 API 클라이언트 설정
const apiClient = axios.create({
  baseURL: '/api/reviews',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// 댓글 API 함수들
export const commentApi = {
  createComment: (reviewId, content) => apiClient.post(`/${reviewId}/comments`,
      {content}),

  updateComment: (reviewId, commentId, content) =>
      apiClient.put(`/${reviewId}/comments/${commentId}`, {content}),

  deleteComment: (reviewId, commentId) =>
      apiClient.delete(`/${reviewId}/comments/${commentId}`),

  fetchComments: (reviewId) => apiClient.get(`/${reviewId}/comments`),

  createReply: (reviewId, parentId, content) =>
      apiClient.post(`/${reviewId}/comments/${parentId}/replies`, {content}),

  likeComment: (reviewId, commentId) =>
      apiClient.post(`/${reviewId}/comments/${commentId}/likes`),

  unlikeComment: (reviewId, commentId) =>
      apiClient.delete(`/${reviewId}/comments/${commentId}/likes`),
};

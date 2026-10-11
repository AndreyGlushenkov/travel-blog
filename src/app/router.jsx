import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import PostDetailPage from '../pages/PostDetailPage/PostDetailPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import CreatePostPage from '../pages/CreatePostPage/CreatePostPage';
import CreateCommentPage from '../pages/CreateCommentPage/CreateCommentPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
export default function Router() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/posts/:id" element={<PostDetailPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/posts/new" element={<CreatePostPage />} />
      <Route path="/posts/:id/comments/new" element={<CreateCommentPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}

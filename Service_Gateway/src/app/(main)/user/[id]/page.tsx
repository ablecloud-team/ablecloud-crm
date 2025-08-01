'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getCookie, logoutIfTokenExpired } from '../../../store/authStore';
import PasswordChangeModal from './passwordChangeModal';

interface User {
  id: string,
  username: string;
  email: string;
  firstName: string;
  // lastName: string;
  type: string;
  telnum:string;
  role: string;
  company: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevPage = searchParams.get('page') || '1';
  const prevType = searchParams.get('type') || 'partner';
  const prevSearchField = searchParams.get('searchField') || 'username';
  const prevSearchValue = searchParams.get('searchValue') || '';
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const role = getCookie('role');
    setRole(role ?? undefined);

    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(`/api/user/${params.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '사용자 정보를 불러올 수 없습니다.');
      }

      if (result.data.error) {
        throw new Error(result.data.error instanceof Error ? result.data.message : result.data.message || '오류가 발생했습니다.');
      }

      setUser(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      if (err instanceof Error) {
        if (err.message == 'Failed to fetch user information') {
          logoutIfTokenExpired(); // 토큰 만료시 로그아웃
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('사용자가 삭제되었습니다.');
      } else {
        throw new Error('사용자 삭제에 실패했습니다.');
      }

      router.push(`/user?page=${prevPage}&type=${prevType}&searchField=${prevSearchField}&searchValue=${prevSearchValue}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-sm">
        <div className="text-gray-500">사용자를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">사용자 상세정보</h1>
        <div className="space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            // style={{ display: role === 'Admin' ? '' : 'none' }}
          >
            비밀번호 변경
          </button>
          <button
            onClick={() => router.push(`/user/${user.id}/edit?page=${prevPage}&type=${prevType}&searchField=${prevSearchField}&searchValue=${prevSearchValue}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            // style={{ display: role === 'Admin' ? '' : 'none' }}
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            // style={{ display: role === 'Admin' ? '' : 'none' }}
          >
            삭제
          </button> 
          <button
            onClick={() => router.push(`/user?page=${prevPage}&type=${prevType}&searchField=${prevSearchField}&searchValue=${prevSearchValue}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            목록
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">아이디</h3>
              <p className="mt-1 text-lg text-gray-900">{user.username}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">이메일</h3>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">이름</h3>
              <p className="mt-1 text-lg text-gray-900">{user.firstName}</p>
            </div>
          </div>
          {/* <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">성</h3>
              <p className="mt-1 text-lg text-gray-900">{user.lastName}</p>
            </div>
          </div> */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">전화번호</h3>
              <p className="mt-1 text-lg text-gray-900">{user.telnum}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">타입</h3>
              <p className="mt-1 text-lg text-gray-900">{user.type}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ROLE</h3>
              <p className="mt-1 text-lg text-gray-900">{user.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">회사</h3>
              <p className="mt-1 text-lg text-gray-900">{user.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal component for password change */}
      <PasswordChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
}
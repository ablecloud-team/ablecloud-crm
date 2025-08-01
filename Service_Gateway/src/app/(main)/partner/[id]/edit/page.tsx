'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getCookie, logoutIfTokenExpired } from '../../../../store/authStore';
import Link from 'next/link';

interface PartnerForm {
  id: number;
  name: string;
  telnum: string;
  level: string;
  // deposit_use: string;
  // deposit: string;
  // credit: string;
  created: string;
  product_category: string[];
}

interface Product_category {
  id: number;
  name: string;
}

export default function PartnerEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevPage = searchParams.get('page') || '1';
  const prevLevel = searchParams.get('level') || 'PLATINUM';
  const prevSearchValue = searchParams.get('searchValue') || '';
  const [formData, setFormData] = useState<PartnerForm | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [product_category, setProduct_category] = useState<Product_category[]>([]);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const role = getCookie('role');
    setRole(role ?? undefined);

    fetchPartnerDetail();
    fetchProduct_category();
  }, []);

  const fetchPartnerDetail = async () => {
    try {
      const response = await fetch(`/api/partner/${params.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '파트너 정보를 불러올 수 없습니다.');
      }

      const data = result.data;

      const productCategoryArray = Array.isArray(data.product_category)
        ? data.product_category
        : (data.product_category || '').split(',').map((id: string) => id.trim());

      setFormData({
        ...data,
        product_category: productCategoryArray,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProduct_category = async () => {
    try {
      let url = `/api/product/category`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '제품 카테고리 정보를 불러올 수 없습니다.');
      }

      setProduct_category(result.data);
    } catch (error) {
      alert('제품 카테고리 목록 조회에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // setIsLoading(true);

    try {
      // 전화번호 밸리데이션
      if (!validateTelnum(formData?.telnum)) {
        throw new Error('전화번호 형식이 올바르지 않습니다.');
      }

      // const updateFormData = { ...formData}
      const formDataToSend: any = {
        ...formData,
        product_category: formData?.product_category.join(','),
        // ...(formData.deposit_use && { credit: formData.deposit })
      };
      const response = await fetch(`/api/partner/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        alert('파트너가 수정되었습니다.');
        router.push(`/partner/${params.id}?page=${prevPage}&level=${prevLevel}&searchValue=${prevSearchValue}`);
      } else {
        throw new Error(response.status == 409? '이미 존재하는 회사입니다.' : '파트너 수정에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleCheckboxGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
  
    setFormData(prev => {
      if (!prev) return prev;
      const selected = prev.product_category || [];

      if (!checked && selected.length === 1 && selected.includes(value)) {
        return prev;
      }

      return {
        ...prev,
        product_category: checked
          ? [...selected, value]
          : selected.filter(item => item !== value),
      };
    });
  };

  // 전화번호 유효성 검사 함수
  const validateTelnum = (telnum?: string) => {
    if (!telnum) return false;
    const phoneRegex = /^(\d{2,3})-(\d{3,4})-(\d{4})$/;
    if (!phoneRegex.test(telnum)) {
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <div className="text-center py-4 text-sm">로딩 중...</div>;
  }

  // if (error) {
  //   return <div className="text-center text-red-500 py-4">{error}</div>;
  // }

  if (!formData) {
    return <div className="text-center py-4 text-sm">파트너 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">파트너 수정</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회사
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호 (-포함)
              </label>
              <input
                type="text"
                name="telnum"
                value={formData.telnum}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                등급
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PLATINUM">PLATINUM</option>
                <option value="GOLD">GOLD</option>
                <option value="SILVER">SILVER</option>
                <option value="VAR">VAR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품 카테고리
              </label>
              <div className="w-1/2 grid grid-cols-2 gap-3 p-3 border border-gray-300 rounded-md">
                {product_category.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center space-x-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      name="product_category"
                      value={item.id}
                      checked={formData.product_category.includes(item.id.toString())}
                      onChange={handleCheckboxGroupChange}
                      className="rounded border-gray-300"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구매 코어수
              </label>
              <input
                type="number"
                name="deposit"
                min="0"
                value={formData.deposit}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Link
              href={`/partner/${params.id}?page=${prevPage}&level=${prevLevel}&searchValue=${prevSearchValue}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '처리 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 

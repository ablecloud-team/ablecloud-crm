'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface LicenseForm {
  id: number;
  license_key: string;
  product_id: string;
  product_name: string;
  product_type: string;
  business_name: string;
  issued: string;
  expired: string;
}

interface Product {
  id: number;
  name: string;
  version: string;
  created: string;
}

export default function LicenseEditPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<LicenseForm | null>({
    id: 0,
    license_key: '',
    product_id: '',
    product_name: '',
    product_type: '',
    business_name: '',
    issued: '',
    expired: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    fetchLicenseDetail();
    fetchProductDetail();
  }, []);

  const fetchLicenseDetail = async () => {
    try {
      const response = await fetch(`/api/license/${params.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '라이센스 정보를 불러올 수 없습니다.');
      }

      setFormData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductDetail = async () => {
    try {
      let url = `/api/product`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (!result.success) {
        // alert(result.message);
        return;
      }

      setProducts(result.data);
    } catch (error) {
      alert('제품 목록 조회에 실패했습니다.');
    }
  };

  //영구 라이센스 체크
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);

    if (event.target.checked) {
      setFormData({
        id: formData?.id?formData?.id:0,
        license_key: formData?.license_key?formData?.license_key:'',
        product_id: formData?.product_id?formData?.product_id:'',
        product_name: formData?.product_name?formData?.product_name:'',
        product_type: formData?.product_type?formData?.product_type:'',
        business_name: formData?.business_name?formData?.business_name:'',
        issued: formData?.issued?formData?.issued:'',
        expired: '9999-12-31',
      });
    } else {
      setFormData({
        id: formData?.id?formData?.id:0,
        license_key: formData?.license_key?formData?.license_key:'',
        product_id: formData?.product_id?formData?.product_id:'',
        product_name: formData?.product_name?formData?.product_name:'',
        product_type: formData?.product_type?formData?.product_type:'',
        business_name: formData?.business_name?formData?.business_name:'',
        issued: formData?.issued?formData?.issued:'',
        expired: formData?.expired?formData?.expired:'',

      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // setIsLoading(true);

    try {
      if((formData?.issued && formData?.expired) && formData?.issued > formData?.expired){
        throw new Error('시작일이 종료일보다 클 수 없습니다.');
      }

      const response = await fetch(`/api/license/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('라이센스가 수정되었습니다.');
      } else {
        throw new Error('라이센스 수정에 실패했습니다.');
      }

      router.push(`/license/${params.id}`);
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

  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  // if (error) {
  //   return <div className="text-center text-red-500 py-4">{error}</div>;
  // }

  if (!formData) {
    return <div className="text-center py-4">라이센스 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">라이센스 수정</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                라이센스 키
              </label>
              <div className="w-1/2 mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="text-gray-900">
                  {formData.license_key}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품명
              </label>
              <div className="w-1/2 mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="text-gray-900">
                  {formData.product_name}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업명
              </label>
              <div className="w-1/2 mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="text-gray-900">
                  {formData.business_name}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작일
              </label>
              <input
                type="date"
                name="issued"
                value={formData.issued}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                만료일
              </label>
              <input
                type="date"
                name="expired"
                value={formData.expired}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{marginLeft: '10px'}}
              />
              <label className="text-sm font-medium text-gray-700" style={{marginLeft: '5px'}}>
                영구 라이센스
              </label> */}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Link
              href={`/license/${params.id}`}
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

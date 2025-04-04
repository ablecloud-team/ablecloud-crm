import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/api';
import { cookies } from 'next/headers';

/**
 * 라이센스 승인
 * @param request 
 * @param params 
 * @returns 
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const username = (await cookies()).get('username')?.value;
    const submitData = {
      approve_user: username,
      status: 'active'
    }

    const response = await fetchWithAuth(`${process.env.LICENSE_API_URL}/license/${params.id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(submitData),
    });

    const license = await response.json();
    
    // if (license === -1) {
    //   return NextResponse.json(
    //     { message: '라이센스를 찾을 수 없습니다.' },
    //     { status: 404 }
    //   );
    // }

    // licenses[index] = { ...licenses[index], ...body };

    return NextResponse.json({ 
      status: 200,
      data: license.data 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '라이센스 승인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
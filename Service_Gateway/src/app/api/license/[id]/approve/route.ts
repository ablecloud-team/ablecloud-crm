import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/api';
import { cookies } from 'next/headers';
import log from '@/utils/logger';

/**
 * 라이선스 승인
 * @param request 
 * @param params 
 * @returns 
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    log.info('API URL ::: PUT /license/'+params.id+'/approve');
    const username = (await cookies()).get('username')?.value;
    const submitData = {
      approve_user: username,
      status: 'active'
    }

    const response = await fetchWithAuth(`${process.env.API_URL}/license/${params.id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(submitData),
    });

    const license = await response.json();
    //('PUT /license/'+params.id+'/approve DATA ::: '+JSON.stringify(license));

    return NextResponse.json({ 
      status: 200,
      data: license.data 
    });
  } catch (error) {
    log.info('PUT /license/'+params.id+'/approve ERROR::: '+error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { message: errorMessage || '라이선스 승인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
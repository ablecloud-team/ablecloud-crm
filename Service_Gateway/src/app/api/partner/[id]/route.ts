import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/api';

/**
 * 파트너 상세 조회
 * @param request 
 * @param params 
 * @returns 
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/partner/${params.id}`);

    const partner = await response.json();
    
    if (!partner) {
      return NextResponse.json(
        { message: '파트너를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      status: 200,
      data: partner 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '파트너 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 파트너 수정
 * @param request 
 * @param params 
 * @returns 
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/partner/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    const partner = await response.json();
    
    // if (partner === -1) {
    //   return NextResponse.json(
    //     { message: '파트너를 찾을 수 없습니다.' },
    //     { status: 404 }
    //   );
    // }

    // partners[index] = { ...partners[index], ...body };

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: partner.message || '파트너 수정 중 오류가 발생했습니다.'
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      status: 200,
      data: partner.data 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '파트너 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 파트너 삭제
 * @param request 
 * @param params 
 * @returns 
 */ 
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/partner/${params.id}`,{
      method: 'DELETE',
    })

    // if (!response) {
    //   return NextResponse.json(
    //     { message: '파트너를 찾을 수 없습니다.' },
    //     { status: 404 }
    //   );
    // }

    // partners = partners.filter(l => l.id !== parseInt(params.id));

    return NextResponse.json({ 
      status: 200,
      message: '파트너가 삭제되었습니다.' 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '파트너 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

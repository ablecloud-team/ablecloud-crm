import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/api';
import { userinfo_id } from '@/utils/userinfo';

/**
 * 고객 상세 조회
 * @param request 
 * @param params 
 * @returns 
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/customer/${params.id}`);
    const customer = await response.json();

    // 고객 데이터에 고객관리담당자 정보 추가
    const data_userinfo = await userinfo_id(customer.manager_id);
    if (!data_userinfo.error) {
      customer.manager_name = data_userinfo.username
      customer.manager_type = data_userinfo.attributes.type[0]
      customer.manager_company_id = data_userinfo.attributes.company_id[0]
    }

    if (customer.manager_type == 'vendor') {
      customer.manager_company = 'ABLECLOUD'
    } else {
      const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/${customer.manager_type}/${customer.manager_company_id}`);
      const company = await response.json();
      customer.manager_company = company.name
    }

    if (!customer) {
      return NextResponse.json(
        { message: '고객을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      status: 200,
      data: customer 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '고객 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 고객 수정
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

    const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/customer/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    const customer = await response.json();

    // if (customer === -1) {
    //   return NextResponse.json(
    //     { message: '고객을 찾을 수 없습니다.' },
    //     { status: 404 }
    //   );
    // }

    // customers[index] = { ...customers[index], ...body };

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: customer.message || '고객 수정 중 오류가 발생했습니다.'
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      status: 200,
      data: customer.data 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '고객 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 고객 삭제
 * @param request 
 * @param params 
 * @returns 
 */ 
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetchWithAuth(`${process.env.PARTNER_API_URL}/customer/${params.id}`,{
      method: 'DELETE',
    })

    // if (!response) {
    //   return NextResponse.json(
    //     { message: '고객을 찾을 수 없습니다.' },
    //     { status: 404 }
    //   );
    // }

    // customers = customers.filter(l => l.id !== parseInt(params.id));

    return NextResponse.json({ 
      status: 200,
      message: '고객이 삭제되었습니다.' 
    });
  } catch (error) {
    return NextResponse.json(
      { message: '고객 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

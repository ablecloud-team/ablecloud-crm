import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/api';
import { userinfo, userinfo_id } from '@/utils/userinfo';
import log from '@/utils/logger';

/**
 * 공지사항 목록 조회
 * @returns 
 */
export async function GET(request: Request) {
  try {
    log.info('API URL ::: GET /notice');
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const title = searchParams.get('title');
    const level = searchParams.get('level');
    const role = searchParams.get('role');  // User 회사 정보만 조회

    // 페이징 파라미터를 포함한 API 호출
    const apiUrl = new URL(`${process.env.API_URL}/notice`);
    apiUrl.searchParams.set('page', page.toString());
    apiUrl.searchParams.set('limit', limit.toString());
    // 필터 파라미터 적용
    if (title) apiUrl.searchParams.set('title', title);
    if (level) apiUrl.searchParams.set('level', level);
    // 유저 역할에 따라 회사 정보 추가(파트너일 경우)
    if (role) {
      const data_userinfo = await userinfo();
      if (!data_userinfo.error && data_userinfo.attributes.type[0] == 'partner') {
        apiUrl.searchParams.set('company_id', data_userinfo.attributes.company_id[0]);
      }
    }

    const response = await fetchWithAuth(apiUrl.toString());
    const data = await response.json();
    //log.info('GET /notice DATA ::: '+JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || '공지사항 조회에 실패했습니다.');
    }

    return NextResponse.json({ 
      success: true,
      status: 200,
      data: data.items || [],
      pagination: {
        currentPage: data.currentPage,
        itemsPerPage: data.itemsPerPage,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0
      }
    });
  } catch (error) {
    log.info('GET /notice ERROR ::: '+error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage || '서버 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

/**
 * 공지사항 생성
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
  try {
    log.info('API URL ::: POST /notice');
    const body = await request.json();
    const response = await fetchWithAuth(`${process.env.API_URL}/notice`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await response.json();
    //log.info('POST /notice DATA ::: '+JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || '공지사항 생성에 실패했습니다.');
    }

    return NextResponse.json({ 
      success: true,
      status: 201,
      data: data
    });
  } catch (error) {
    log.info('POST /notice ERROR ::: '+error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage || '공지사항 생성 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}
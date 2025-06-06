import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/api';
import log from '@/utils/logger';

/**
 * 사용자 상세 조회
 * @param request 
 * @param params 
 * @returns 
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    log.info('API URL ::: GET /user/'+params.id);
    const response = await fetchWithAuth(`${process.env.API_URL}/user/${params.id}`);
    const user = await response.json();
    // // 1. client_credentials token 가져오기
    // const submitData_token = {
    //   client_id: process.env.CLIENT_ID,
    //   client_secret: process.env.CLIENT_SECRET,
    //   scope: process.env.SCOPE,
    //   grant_type: 'client_credentials',
    // }

    // const res_token = await fetch(`${process.env.KEYCLOAK_API_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: new URLSearchParams(submitData_token).toString()
    // });

    // const client_token = await res_token.json();

    // // 2. 사용자 정보 가져오기
    // const res_user = await fetch(`${process.env.KEYCLOAK_API_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${params.id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${client_token.access_token}`,
    //   },
    // });

    // const data_user = await res_user.json();

    // // json 항목 담기(attributes: { type: [ 'vendor' ], telnum: [ '02-000-0000' ] })
    // data_user.type = data_user.attributes.type
    // data_user.telnum = data_user.attributes.telnum
    // data_user.company_id = data_user.attributes.company_id[0]

    // // 파트너/고객 id를 통해 회사이름 가져오기
    // if (data_user.type == 'vendor') {
    //   data_user.company = 'ABLECLOUD'
    // } else {
    //   const response = await fetchWithAuth(`${process.env.API_URL}/${data_user.type}/${data_user.company_id}`);
    //   const company = await response.json();
    //   data_user.company = company.name
    // }

    // // 3. 사용자 정보에 role 추가
    // const res_role = await fetch(`${process.env.KEYCLOAK_API_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${params.id}/role-mappings/realm`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${client_token.access_token}`,
    //   }
    // });

    // const data_role = await res_role.json();

    // for(var idx in data_role){
    //   if(data_role[idx].name === "Admin" || data_role[idx].name === "User"){
    //     data_user.role = data_role[idx].name
    //   }
    // }

    //log.info('GET /user/'+params.id+' DATA ::: '+JSON.stringify(data_user));

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return NextResponse.json({ 
      status: 200,
      data: user 
    });
  } catch (error) {
    log.info('GET /user/'+params.id+' ERROR ::: '+error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { message: errorMessage || '사용자 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 사용자 수정
 * 1. client_credentials token 가져오기
 * 2. 사용자 수정
 * @param request 
 * @param params 
 * @returns 
 */ 
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    log.info('API URL ::: PUT /user/'+params.id);
    // 1. client_credentials token 가져오기
    const submitData_token = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: process.env.SCOPE,
      grant_type: 'client_credentials',
    }

    const res_token = await fetch(`${process.env.KEYCLOAK_API_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(submitData_token).toString()
    });

    const client_token = await res_token.json();

    // 2. 사용자 수정
    const body = await request.json();
    const { firstName, email, telnum, type, company_id} = body;
    const attributes = {
      telnum : telnum,
      type,
      company_id : [company_id]
    }
    const submitData = {
      firstName,
      lastName: firstName,
      email,
      // enabled: true,
      // emailVerified: false,
      attributes
    }

    const response = await fetch(`${process.env.KEYCLOAK_API_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${params.id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client_token.access_token}`,
      },
      body: JSON.stringify(submitData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errorMessage);
    }

    if (!response) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return NextResponse.json({ 
      status: 200,
      message: '사용자가 수정되었습니다.' 
    });
  } catch (error) {
    log.info('PUT /user/'+params.id+' ERROR ::: '+error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { message: errorMessage || '사용자 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 사용자 삭제
 * 1. client_credentials token 가져오기
 * 2. 사용자 삭제
 * @param request 
 * @param params 
 * @returns 
 */ 
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    log.info('API URL ::: DELETE /user/'+params.id);
    // 1. client_credentials token 가져오기
    const submitData_token = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: process.env.SCOPE,
      grant_type: 'client_credentials',
    }

    const res_token = await fetch(`${process.env.KEYCLOAK_API_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(submitData_token).toString()
    });

    const client_token = await res_token.json();

    // 2. 사용자 삭제
    const response = await fetch(`${process.env.KEYCLOAK_API_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${params.id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client_token.access_token}`,
      },
    });

    if (!response) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return NextResponse.json({ 
      status: 200,
      message: '사용자가 삭제되었습니다.' 
    });
  } catch (error) {
    log.info('DELETE /user/'+params.id+' ERROR ::: '+error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { message: errorMessage || '사용자 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
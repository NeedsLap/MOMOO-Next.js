import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import {
  checkAlbumPermission,
  getAlbumByName,
  getFeedsData,
  getSharedAlbums,
} from '@/utils/SDKUtils';

import { AlbumType } from '@/types/album';
	@@ -20,36 +20,36 @@ export async function GET(req: NextRequest) {
  if (!userUid) {
    return NextResponse.json(
      {
        error: '인증되지 않은 사용자입니다.',
      },
      {
        status: 401,
      },
    );
  }

  if (!limit || !skip || !albumName || !uid) {
    return NextResponse.json(
      {
        error: '요청 매개변수가 누락되었습니다.',
      },
      {
        status: 400,
      },
    );
  }

  const limitNum = parseInt(limit);
  const skipNum = parseInt(skip);

  if (limitNum <= skipNum || skipNum < 0) {
    return NextResponse.json(
      {
        error: '요청 매개변수가 올바르지 않습니다.',
      },
      {
        status: 400,
      },
    );
  }

	@@ -58,11 +58,11 @@ export async function GET(req: NextRequest) {
  if (!albumDoc) {
    return NextResponse.json(
      {
        error: '존재하지 않는 앨범입니다.',
      },
      {
        status: 404,
      },
    );
  }

	@@ -76,23 +76,27 @@ export async function GET(req: NextRequest) {
  if (!hasPermission) {
    return NextResponse.json(
      {
        error: '접근 권한이 없는 앨범입니다.',
      },
      {
        status: 403,
      },
    );
  }

  // 최신순으로 가져오기 위해 뒤에서부터 slice
  const feedList: string[] = [...albumDoc.data().feedList];

  if (feedList.length < skipNum) {
    return NextResponse.json([]);
  }
    
  const albumType: AlbumType = userUid === uid ? 'my' : 'shared';
  const startIndex =
    feedList.length - limitNum < 0 ? 0 : feedList.length - limitNum;
  const feeds = await getFeedsData(
    feedList.slice(startIndex, feedList.length - skipNum).reverse(),
    uid,
    albumType,
  );

  return NextResponse.json(feeds);
}

import {
  collection,
  getDocs,
  DocumentData,
  query,
  orderBy,
} from 'firebase/firestore';

import { appFireStore } from '@/firebase/config';
import useAuthState from '@/hooks/auth/useAuthState';

const GetAccordionData = () => {
  const { user } = useAuthState();

  const getAccordionData = async () => {
    const albumDataList: DocumentData[] = [];
    const albumIdList: string[] = [];

    try {
      const q = query(
        collection(appFireStore, user.uid, user.uid, 'album'),
        orderBy('createdTime'),
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        albumDataList.push({ ...doc.data(), id: doc.id });
        albumIdList.push(doc.id);
      });
    } catch (error) {
      console.log(error);
    }

    const accordionData = [
      {
        question: '앨범 선택 (선택)',
        answer: [],
      },
      {
        question: '오늘의 날씨 (선택)',
        answer: [
          '/images/sunny.svg',
          '/images/partly-sunny.svg',
          '/images/cloudy.svg',
          '/images/rainy.svg',
          '/images/snowy.svg',
        ],
      },
      {
        question: '오늘의 기분 (선택)',
        answer: [
          '/images/excited.svg',
          '/images/smiling.svg',
          '/images/yummy.svg',
          '/images/frowning.svg',
          '/images/sad.svg',
          '/images/angry.svg',
        ],
      },
    ];

    interface AlbumIdData {
      albumName: string;
      docId: string;
    }

    const albumIdData: AlbumIdData[] = [];

    albumDataList.forEach((albumData, i) => {
      accordionData[0].answer.push(albumData.name);
      albumIdData.push({
        albumName: albumData.name,
        docId: albumIdList[i],
      });
    });

    return { accordionData, albumIdData };
  };

  return getAccordionData;
};

export default GetAccordionData;

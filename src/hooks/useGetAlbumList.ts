import { useState, useEffect } from 'react';

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';

import { appFireStore } from '@/firebase/config';
import useAuthState from '@/hooks/auth/useAuthState';

export default function useGetAlbumList() {
  const { user } = useAuthState();
  const [albumDataList, setAlbumDataList] = useState<DocumentData[]>([]);
  const [albumIdList, setAlbumIdList] = useState<string[]>([]);
  const [latestAlbumList, setLatestAlbumList] = useState<DocumentData[]>([]);

  const fetchData = async () => {
    const q = query(
      collection(appFireStore, user.uid, user.uid, 'album'),
      orderBy('createdTime'),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedAlbumDataList: DocumentData[] = [];
      const updatedAlbumIdList: string[] = [];
      querySnapshot.forEach((doc) => {
        updatedAlbumDataList.push({ ...doc.data(), id: doc.id });
        updatedAlbumIdList.push(doc.id);
      });

      const latestAlbumListtoSet = [...updatedAlbumDataList].reverse();
      const allFeedsAlbumData = latestAlbumListtoSet.pop();

      if (allFeedsAlbumData) {
        latestAlbumListtoSet.unshift(allFeedsAlbumData);
      }

      setLatestAlbumList(latestAlbumListtoSet);
      setAlbumDataList(updatedAlbumDataList);
      setAlbumIdList(updatedAlbumIdList);
    });

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    fetchData();
  }, [collection]);

  return { albumDataList, albumIdList, latestAlbumList };
}

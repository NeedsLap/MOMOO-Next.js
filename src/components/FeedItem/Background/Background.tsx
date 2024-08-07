import Address from '@/components/FeedItem/Background/Address';
import DateTime from '@/components/FeedItem/Background/DataTime';
import StyledBackground from '@/components/FeedItem/Background/StyledBackground';
import convertMillisToDatetime from '@/utils/date';

export default function Background({ millis, address }: { millis: number; address: string }) {
  const dateTime = convertMillisToDatetime(millis);

  return (
    <StyledBackground>
      <DateTime dateTime={dateTime} />
      {address && <Address address={address} />}
    </StyledBackground>
  );
}

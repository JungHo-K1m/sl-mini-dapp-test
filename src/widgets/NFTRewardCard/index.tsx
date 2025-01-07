import { IoDice, IoGameController, IoTicket } from 'react-icons/io5';
import Images from '@/shared/assets/images';

interface NFTReward {
  imgSrc: string;
  altText: string;
  title: string;
  rewards: { icon: React.ReactNode; description: string }[];
}

const NFTRewardCard: React.FC<NFTReward> = ({ imgSrc, altText, title, rewards }) => (
  <div className="relative space-y-2">
    <div className="flex flex-row items-center gap-2">
      <img src={imgSrc} alt={altText} className="w-6 h-6" />
      <p className="font-semibold">{title}</p>
    </div>
    <div className="pl-6 text-sm space-y-1">
      {rewards.map((reward, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          {reward.icon}
          <p>{reward.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const NFTRewardList: React.FC = () => {
  const nftRewards = [
    {
      imgSrc: Images.Gold,
      altText: 'Gold',
      title: 'Gold NFT',
      rewards: [
        { icon: <IoGameController className="w-5 h-5" />, description: 'Game Board Points : x30' },
        { icon: <IoTicket className="w-5 h-5" />, description: 'Raffle Tickets : x6' },
      ],
    },
    {
      imgSrc: Images.Silver,
      altText: 'Silver',
      title: 'Silver NFT',
      rewards: [
        { icon: <IoGameController className="w-5 h-5" />, description: 'Game Board Points : x20' },
        { icon: <IoTicket className="w-5 h-5" />, description: 'Raffle Tickets : x4' },
      ],
    },
    {
      imgSrc: Images.Bronze,
      altText: 'Bronze',
      title: 'Bronze NFT',
      rewards: [
        { icon: <IoGameController className="w-5 h-5" />, description: 'Game Board Points : x10' },
        { icon: <IoTicket className="w-5 h-5" />, description: 'Raffle Tickets : x2' },
      ],
    },
    {
      imgSrc: Images.RewardNFT,
      altText: 'Reward Booster(x5 or x2)',
      title: 'Reward Booster(x5 or x2)',
      rewards: [
        { icon: <IoGameController className="w-5 h-5" />, description: 'Board & Spin Reward : x5' },
        { icon: <IoGameController className="w-5 h-5" />, description: 'Board & Spin Reward : x2' },
      ],
    },

  ];

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col bg-[#1F1E27] p-5 rounded-3xl border-2 border-[#35383F] font-medium gap-4">
        {nftRewards.map((nft, index) => (
          <NFTRewardCard key={index} {...nft} />
        ))}
      </div>
      <button onClick={()=>{alert("상점기능 준비중입니다.")}} className=" sticky bottom-0 font-medium bg-[#0147E5] rounded-full h-14 w-[165px] self-center">
        Shop NFT
      </button>
    </div>
  );
};

export default NFTRewardList;

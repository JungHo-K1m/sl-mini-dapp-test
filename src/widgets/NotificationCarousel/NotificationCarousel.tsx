import React from 'react';
import {
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/components/ui';
import Imgs from '@/shared/assets/images';
import Typography from '@/shared/components/typography';
import Autoplay from 'embla-carousel-autoplay';

const notifications = [
  {
    title: 'Update Notification',
    message:
      'We have completed the update to ensure a stable service. Enjoy the improved experience!',
    image: Imgs.Loudspeaker,
  },
  {
    title: 'Airdrop Event Alert!',
    message:
      'Get ready to receive free tokens! Join our special airdrop event from June 20, 2024, to July 20, 2024. Sign up, complete a simple survey, and invite friends to earn even more rewards. Don’t miss this chance to boost your token collection!',
    image: Imgs.Loudspeaker,
  },
];

const NotificationCarousel: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start', loop: true }}
      plugins={[plugin.current]}
    >
      <CarouselContent>
        {notifications.map((notification, index) => (
          <CarouselItem key={index}>
            <Card className="rounded-3xl h-36 ">
              <div className="flex items-center p-4">
                <div className="ml-4 flex-1">
                  <Typography.Large>{notification.title}</Typography.Large>
                  <Typography.Muted className="line-clamp-3">
                    {notification.message}
                  </Typography.Muted>
                </div>
                <div className="flex flex-col">
                  <img
                    src={notification.image}
                    alt="Notification"
                    className="mx-auto w-24 md:w-32"
                  />
                  <div
                    className="text-white text-sm px-3 rounded-full text-center w-16 self-end"
                    style={{ backgroundColor: 'rgba(115,115,115,0.8)' }}
                  >
                    {current} / <span className="opacity-50">{count}</span>
                  </div>
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default NotificationCarousel;

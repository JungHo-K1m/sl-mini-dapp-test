interface TopTitleProps {
  title: string;
  className?: string;
}

const TopTitle: React.FC<TopTitleProps> = ({ title, className }) => {
  return (
    <div
      className={`h-14 flex items-center justify-center font-bold text-xl mb-8 ${className}`}
    >
      <p>{title}</p>
    </div>
  );
};

export { TopTitle };

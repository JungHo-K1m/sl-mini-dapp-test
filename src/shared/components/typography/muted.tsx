import TypographyType from './typographyType';

interface TypographyTypeMuted extends TypographyType {
  onClick?: () => void;
}

export function TypographyMuted({
  children,
  className,
  onClick,
}: TypographyTypeMuted) {
  return (
    <p
      className={`text-sm text-muted-foreground ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </p>
  );
}

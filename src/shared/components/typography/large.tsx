import TypographyType from './typographyType';

export function TypographyLarge({ children, className }: TypographyType) {
  return (
    <div className={`text-lg font-semibold ${className || ''}`}>{children}</div>
  );
}

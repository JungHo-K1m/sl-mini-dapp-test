import TypographyType from './typographyType';

export function TypographySmall({ children, className }: TypographyType) {
  return (
    <small className={`text-sm font-medium leading-none ${className || ''}`}>
      {children}
    </small>
  );
}

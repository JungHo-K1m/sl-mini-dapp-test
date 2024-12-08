import TypographyType from './typographyType';

export function TypographyP({ children, className }: TypographyType) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className || ''}`}>
      {children}
    </p>
  );
}

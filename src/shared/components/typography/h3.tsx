import TypographyType from './typographyType';

export function TypographyH3({ children, className }: TypographyType) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${
        className || ''
      }`}
    >
      {children}
    </h3>
  );
}

import TypographyType from './typographyType';

export function TypographyH4({ children, className }: TypographyType) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${
        className || ''
      }`}
    >
      {children}
    </h4>
  );
}

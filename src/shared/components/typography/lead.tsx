import TypographyType from './typographyType';

export function TypographyLead({ children, className }: TypographyType) {
  return (
    <p className={`text-xl text-muted-foreground ${className || ''}`}>
      {children}
    </p>
  );
}

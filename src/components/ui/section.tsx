import React from "react";
import { Container } from "./container";

type Props = React.PropsWithChildren<{
  id?: string;
  className?: string;
  innerClassName?: string;
}>;

export function Section({ id, className = "", innerClassName = "", children }: Props) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`}>
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}

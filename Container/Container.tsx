import React from "react";

interface ContainerProps {
  children?: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div>
      <aside></aside>
      <header></header>
      <main>{children}</main>
    </div>
  );
}

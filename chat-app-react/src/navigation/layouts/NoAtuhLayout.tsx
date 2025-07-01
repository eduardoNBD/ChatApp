import { ReactNode } from 'react';

type NoAuthLayoutProps = {
  children: ReactNode;
};

const NoAuthLayout = ({ children }: NoAuthLayoutProps) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

export default NoAuthLayout;

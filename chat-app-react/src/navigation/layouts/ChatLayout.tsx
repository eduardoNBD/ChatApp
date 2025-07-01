import { ReactNode } from 'react';

type ChatLayoutProps = {
  children: ReactNode;
};

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

export default ChatLayout;
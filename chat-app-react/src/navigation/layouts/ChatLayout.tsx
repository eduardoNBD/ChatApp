import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

type ChatLayoutProps = {
  children: ReactNode;
  title: String;
  description: string;
};

const ChatLayout = ({ children, title, description  }: ChatLayoutProps) => {
  return (
    <>
      <Helmet>
          {title && <title>{title}</title>} 
          {description && <meta name="description" content={description} />} 
        </Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </>
  );
};

export default ChatLayout;
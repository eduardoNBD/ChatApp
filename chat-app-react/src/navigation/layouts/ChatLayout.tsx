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
      <div>
        {children}
      </div>
    </>
  );
};

export default ChatLayout;
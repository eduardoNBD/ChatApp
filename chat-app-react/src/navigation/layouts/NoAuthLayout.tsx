import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

type NoAuthLayoutProps = {
  children: ReactNode;
  title: String;
  description: string;
};

const NoAuthLayout = ({ children, title, description }: NoAuthLayoutProps) => {
  return (
    <>
      <Helmet>
        {title && <title>{title}</title>} 
        {description && <meta name="description" content={description} />} 
      </Helmet>
      {children}  
    </>
  );
};

export default NoAuthLayout;

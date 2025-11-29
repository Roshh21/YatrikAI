import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider } from "next-themes";

const PageMeta = ({
  title,
  description,
}: {
  title: string; 
  description: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  </HelmetProvider>
);

export default PageMeta;

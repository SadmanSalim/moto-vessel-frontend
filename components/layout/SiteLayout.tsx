import { Footer } from "./Footer";
import { Header } from "./Header";

type SiteLayoutProps = {
  children: React.ReactNode;
  hideHeader?: boolean;
};

export function SiteLayout({ children, hideHeader = false }: SiteLayoutProps) {
  return (
    <>
      {!hideHeader ? <Header /> : null}
      {children}
      <Footer />
    </>
  );
}

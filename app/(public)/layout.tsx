import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwritePing from '@/components/AppwritePing';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
      <AppwritePing />
    </>
  );
}

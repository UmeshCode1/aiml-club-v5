import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwritePing from '@/components/AppwritePing';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="min-h-screen pt-16 relative z-10">
        {children}
      </main>
      <Footer />
      <AppwritePing />
    </>
  );
}

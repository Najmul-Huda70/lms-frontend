export default function Layout({ children, params }) {
  return (
    <section className="px-5 w-full mx-auto rounded-lg h-screen shadow-sm">
      {children}
    </section>
  );
}
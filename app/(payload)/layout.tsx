// This layout intentionally omits the site's Navbar, Sidebar, and Footer
// so the Payload admin panel renders cleanly without the app chrome.
export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}

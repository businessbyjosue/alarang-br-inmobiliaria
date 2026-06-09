// Layout raíz de /admin — solo pasa children.
// El layout con AdminNav vive en (panel)/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const instant = false;

export default function OrganizationsLayout({
  children,
}: LayoutProps<"/admin/dashboard/organizations">) {
  return <div>{children}</div>;
}

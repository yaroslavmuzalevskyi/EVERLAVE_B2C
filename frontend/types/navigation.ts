export type NavDropdownItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type SectionTab = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  dropdownItems?: NavDropdownItem[];
};

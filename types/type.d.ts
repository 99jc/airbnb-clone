export interface NavMenuItemProps {
  title: string;
  image?: string;
  word: string;
}
export interface NavSubMenuProps {
  title: string;
  inventory: Array<NavMenuItemProps>;
}

export interface SearchParamsProps {
  spotName: string | undefined;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  adult: number | undefined;
  child: number | undefined;
  baby: number | undefined;
  pet: number | undefined;
  flexible: number | undefined;
}

export interface User {
  id: string;
  email?: string;
  picture?: string;
  name?: string;
  familyName?: string;
}

export interface NewHosting {
  message: string;
  hostingId: string;
}

export interface NavItem {
  icon?: string;
  label: string;
  href: string;
}

export interface ProductCard {
  title: string;
  description: string;
  image?: string;
  href: string;
  cta?: string;
  soon?: boolean;
}

export interface ContentCard {
  title: string;
  description: string;
  href?: string;
}

export interface HomepageSection {
  type: 'hero' | 'quicknav' | 'products' | 'feature' | 'ai' | 'why';
  enabled?: boolean;
  heading?: string;
  title?: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaCheckout?: string;
  greyBackground?: boolean;
  items?: NavItem[];
  cards?: ProductCard[] | ContentCard[];
}

export interface HomepageData {
  seo: { title: string; description: string };
  greeting: {
    headline: string;
    subheadline: string;
    buttons: { label: string; href: string }[];
  };
  sections: HomepageSection[];
}

export interface SiteData {
  promoBanner: {
    enabled: boolean;
    text: string;
    linkLabel: string;
    linkHref: string;
  };
}

interface Project {
  title: string
  description: string
  company?: string
  href?: string
  imgSrc?: string
  meta?: {
    title: string
    links: { title: string; href: string }[]
  }
}

const projectsData: Project[] = [
  {
    title: 'Enterprise Design System',
    description: `Led and support 12-30 contributors to build and maintain a design system with web components for use in Angular 1-16 and React 16-18 projects. Components are now used in over 150+ products`,
    company: `Thomson Reuters`,
    imgSrc: '/static/images/work/westlaw.jpg',
    meta: {
      title: 'Adopted by',
      links: [
        {
          title: `Co-Counsel`,
          href: 'https://legal.thomsonreuters.com/en/c/cocounsel/generative-ai-suite',
        },
        {
          title: 'Onvio',
          href: 'https://tax.thomsonreuters.com/en/accounting-solutions/onvio',
        },
        {
          title: `Practical Law`,
          href: `https://thomsonreuters.hubs.vidyard.com/watch/47WU7AiPsTfpao2wQqBQdN?autoplay=2&second=12.27`,
        },
        {
          title: `Westlaw Edge`,
          href: 'https://www.thomsonreuters.ca/en/products/westlaw-edge',
        },
        {
          title: `Developer Portal`,
          href: 'https://developers.thomsonreuters.com/',
        },
      ],
    },
  },
  {
    title: 'Radius 2.0 design system accelerator',
    company: 'Rangle.io',
    description: `Worked on a rotating team of 4 to develop a command line tool with a boilerplate Figma UI Kit to accelerate the bootstrapping of design systems based on selection of JS framework, CSS strategy, and CI tool`,
    imgSrc: '/static/images/work/radius-home.svg',
    href: 'https://radius.rangle.io/',
  },
  {
    title: 'Idea to MVP: Insurance Payer Health Portal',
    company: 'Smile CDR',
    description: `Working as Solutions & UX Developer, I ran 5-day design sprints to lead team and stakeholders from ideation to MVP within 3 months. I also delivered a white label style guide that ended up being used on 2 products.`,
    imgSrc: '/static/images/work/member-portal.webp',
    meta: {
      title: 'Products',
      links: [
        {
          title: 'AppSphere',
          href: `https://www.smiledigitalhealth.com/appsphere`,
        },
        {
          title: 'Insurance Payer Member Portal',
          href: 'https://www.smiledigitalhealth.com/payer-member-portal',
        },
      ],
    },
  },
  {
    title: 'Modernizing heart procedure wait time system',
    company: 'Smile CDR',
    description: `Revamping a system that hospital administrators use to calculate heart disease and stroke procedure priority in Ontario. Heroic feats involve retrofitting a typeahead to also become a dropdown selector, and implementing 250 combinations of live validations on form fields in Angular 9`,
    imgSrc: '/static/images/work/wtis.png',
    href: 'https://youtu.be/0dRKoS6YudU?si=h3hb515Nt-xJ1awE&t=149',
  },
  {
    title: 'User account settings and portfolio allocation features',
    company: `Capintel`,
    description: `Internal user account settings and portfolio allocation features for a product connecting asset managers and financial advisors. Designs by Niclas Erst at Fintory`,
    imgSrc: '/static/images/work/allocation.png',
    href: 'https://www.capintel.com/independent-advisors#:~:text=Instant%20analytics%20at%20your%20fingertips.',
  },
  {
    title: 'V/Art: A virtual art gallery',
    company: 'Trinity Square Video',
    imgSrc: '/static/images/work/tgm.jpg',
    description:
      'Research and development of a virtual reality exhibition as mobile app presented on a free mobile VR app platform for iOS and Android.',
    meta: {
      title: 'Press',
      links: [
        {
          title: '"Venturing into the Virtual World", Globe and Mail, 2017.',
          href: 'https://www.theglobeandmail.com/arts/art-and-architecture/venturing-into-the-virtual-world-with-a-new-artapp/article37066961/',
        },
      ],
    },
  },
]

export default projectsData

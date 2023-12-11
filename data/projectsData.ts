interface Project {
  title: string,
  description: string,
  href?: string,
  imgSrc?: string,
}

const projectsData: Project[] = [
  {
    title: 'Enterprise Design System',
    description: `Lead and support 12-30 contributors at anytme to build and maintain design system with web components for use in Angular 1-16 and React 16-18 projects. Components are currently being used in chatbots within flagship products. `,
    company: `Thomson Reuters`,
    imgSrc: '/static/images/work/westlaw.jpg',
    href: 'https://thomsonreuters.hubs.vidyard.com/watch/47WU7AiPsTfpao2wQqBQdN?autoplay=2&second=12.27',
  },
  {
    title: 'Radius 2.0 design system accelerator',
    company: 'Rangle.io',
    description: `An internal tool with UI Kit and command line tool for accelerating the bootstrapping of design systems`,
    imgSrc: '/static/images/work/radius-home.svg',
    href: 'https://radius.rangle.io/',
  },
  {
    title: 'Idea to MVP: Insurance Payer Health Portal',
    company: 'Smile CDR',
    description: `Imagine if Sunlife and a healthcare portal had a baby in the form of a web app. Working as Solutions & UX Developer, I ran 5-day design sprints to lead team and stakeholders from ideation to MVP, delivered a white label style guide used on 2 products.`,
    imgSrc: '/static/images/work/member-portal.webp',
    href: 'https://www.smiledigitalhealth.com/payer-member-portal',
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
    href: 'https://capintel.com/independent-advisors/',
  },
  {
    title: 'V/Art: A virtual art gallery',
    company: 'Trinity Square Video',
    imgSrc: '/static/images/work/tgm.jpg',
    description:
      'Research and development of a virtual reality exhibition as mobile app presented on a free mobile VR app platform for iOS and Android.',
    press: [
      {
        title: '"Venturing into the Virtual World", Globe and Mail, 2017.',
        href: 'https://www.theglobeandmail.com/arts/art-and-architecture/venturing-into-the-virtual-world-with-a-new-artapp/article37066961/',
      },
    ],
  },
  {
    title: 'The Carded',
    description: `Civic Tech Project for helping people affected by racial profiling in Toronto.`,
    imgSrc: '/static/images/work/thecarded.png',
    href: 'http://thecarded.ca/',
  },
]

export default projectsData

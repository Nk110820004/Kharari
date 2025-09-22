export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
}

export const initialJobs: Job[] = [
  {
    id: 'fe-1',
    title: 'Frontend Engineer',
    company: 'Innovatech',
    companyLogo: 'https://logo.clearbit.com/innovatech.com',
    location: 'San Francisco, CA (Remote)',
    description: 'We are seeking a passionate Frontend Engineer to build beautiful and performant user interfaces for our next-generation platform.',
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and front-end libraries for future use',
      'Translate designs and wireframes into high-quality code',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers',
    ],
    qualifications: [
      'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model',
      'Thorough understanding of React.js and its core principles',
      'Experience with popular React.js workflows (such as Flux or Redux)',
      'Familiarity with modern front-end build pipelines and tools',
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    id: 'be-1',
    title: 'Backend Engineer',
    company: 'DataStream',
    companyLogo: 'https://logo.clearbit.com/datastream.com',
    location: 'New York, NY',
    description: 'Join our backend team to design, build, and maintain the server-side logic for our high-traffic data processing application.',
    responsibilities: [
      'Design and implement scalable RESTful APIs',
      'Work with our data science team to build out our data pipeline',
      'Manage hosting environments, including database administration and scaling applications to support load changes',
      'Implement security and data protection solutions',
    ],
    qualifications: [
      'Proven experience as a Backend Engineer',
      'Experience with Python and frameworks like Django or Flask',
      'Proficient with SQL and NoSQL databases such as PostgreSQL and MongoDB',
      'Knowledge of cloud platforms like AWS or Google Cloud',
    ],
    skills: ['Python', 'Node.js', 'Go', 'SQL', 'AWS'],
  },
  {
    id: 'pm-1',
    title: 'Product Manager',
    company: 'Synergy AI',
    companyLogo: 'https://logo.clearbit.com/synergy.com',
    location: 'Austin, TX',
    description: 'Define the future of our AI-driven products by leading a cross-functional team to conceptualize, build, and launch new features.',
    responsibilities: [
      'Develop and maintain the product roadmap',
      'Gather and prioritize product and customer requirements',
      'Work closely with engineering, sales, marketing, and support to ensure revenue and customer satisfaction goals are met',
      'Define the product strategy and vision',
    ],
    qualifications: [
      '3+ years of experience in product management, preferably in a SaaS or AI company',
      'Demonstrated success defining and launching excellent products',
      'Excellent written and verbal communication skills',
      'Strong technical background is a plus',
    ],
    skills: ['Agile', 'Roadmapping', 'User Research', 'JIRA'],
  },
  {
    id: 'ds-1',
    title: 'Data Scientist',
    company: 'QuantumLeap',
    companyLogo: 'https://logo.clearbit.com/quantumleap.com',
    location: 'Boston, MA (Hybrid)',
    description: 'Utilize your expertise in statistical analysis and machine learning to derive insights from large datasets and help shape our business strategy.',
    responsibilities: [
        'Analyze large amounts of information to discover trends and patterns',
        'Build predictive models and machine-learning algorithms',
        'Present information using data visualization techniques',
        'Propose solutions and strategies to business challenges',
    ],
    qualifications: [
        'Proven experience as a Data Scientist or Data Analyst',
        'Experience in data mining and machine learning',
        'Strong knowledge of SQL and Python; familiarity with Scala, Java or C++ is an asset',
        'Experience using business intelligence tools (e.g., Tableau) and data frameworks (e.g., Hadoop)',
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Tableau'],
  },
  {
    id: 'ux-1',
    title: 'UX/UI Designer',
    company: 'CreativeMinds',
    companyLogo: 'https://logo.clearbit.com/creativeminds.com',
    location: 'Remote',
    description: 'Design intuitive and engaging user experiences for our suite of creative applications. You will be responsible for the entire design process from user research to final UI.',
    responsibilities: [
        'Conduct user research and evaluate user feedback',
        'Create user flows, wireframes, prototypes, and mockups',
        'Design and deliver mockups optimized for a wide range of devices and interfaces',
        'Collaborate with product managers and engineers to implement innovative solutions',
    ],
    qualifications: [
        '3+ years of UX/UI design experience',
        'A strong portfolio of design projects',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Excellent visual design skills with sensitivity to user-system interaction',
    ],
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
  },
];
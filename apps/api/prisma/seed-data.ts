export const articles = [
  {
    slug: 'welcome-to-campus',
    title: 'Welcome to Campus',
    summary: 'Start your first week with confidence.',
    body: `Welcome to Campus University! This short guide highlights the essential offices and services you should know during your first week. Visit the Student Success Center for advising, stop by the Library to activate your account, and check the Campus App for shuttle routes.`,
    heroImage: null,
    tags: ['orientation', 'student-life'],
    publishedAt: new Date('2024-01-08T09:00:00Z'),
  },
  {
    slug: 'study-spaces',
    title: 'Top Study Spaces',
    summary: 'Quiet corners and collaborative hubs for productive sessions.',
    body: `Looking for a productive place to study? The Library's fourth floor is the designated quiet zone, while the Innovation Hub offers reservable rooms with smart displays. Outdoor enthusiasts can use the Lakeside Pavilion Wi-Fi tables during daylight hours.`,
    heroImage: null,
    tags: ['academics', 'spaces'],
    publishedAt: new Date('2024-02-12T14:30:00Z'),
  },
];

export const faqs = [
  {
    question: 'How do I get my student ID?',
    answer:
      'Visit the Campus Card Office in the Union with a government-issued ID. They are open Monday through Saturday during the first month of classes.',
  },
  {
    question: 'Where can I park on campus?',
    answer:
      'Students can park in the Blue or Green lots with the appropriate permit. Purchase permits online and display them on your dashboard.',
  },
  {
    question: 'Does the campus have mental health resources?',
    answer:
      'Yes. The Counseling Center offers free sessions to enrolled students. Book an appointment through the Health Portal or by calling the front desk.',
  },
];

export const events = [
  {
    title: 'Club Expo',
    summary: 'Discover 150+ student organizations.',
    description:
      'Meet club leaders, sign up for newsletters, and grab giveaways in the Recreation Center.',
    startAt: new Date('2024-08-28T16:00:00Z'),
    endAt: new Date('2024-08-28T19:00:00Z'),
    location: 'Recreation Center Courts 1-3',
  },
  {
    title: 'Research Showcase',
    summary: 'Undergraduate and graduate students present their work.',
    description:
      'Poster sessions, lightning talks, and faculty panels focused on interdisciplinary innovation.',
    startAt: new Date('2024-11-12T15:00:00Z'),
    endAt: new Date('2024-11-12T20:00:00Z'),
    location: 'Innovation Hub Atrium',
  },
];

export const pois = [
  {
    name: 'Administrative Block',
    summary: 'Admissions, registrar, and key academic offices for MUJ.',
    description:
      'The primary stop for student services, fee submissions, and official documentation. Located along the main boulevard with easy access to visitor parking.',
    latitude: 26.8439,
    longitude: 75.5653,
    imageUrl: null,
  },
  {
    name: 'Central Library',
    summary: 'Learning Resource Centre with group study rooms and archives.',
    description:
      'Hosts the digital library, quiet reading halls, and collaborative study pods. Open late during examinations with café seating on the ground floor.',
    latitude: 26.8447,
    longitude: 75.5669,
    imageUrl: null,
  },
  {
    name: 'Innovation & Incubation Centre',
    summary: 'Startup incubator and research labs overlooking the academic plaza.',
    description:
      'Supports student ventures with prototyping labs, mentorship programs, and showcase events run by the Centre for Innovation and Entrepreneurship.',
    latitude: 26.8454,
    longitude: 75.5682,
    imageUrl: null,
  },
  {
    name: 'Hostel Complex',
    summary: 'Residential towers with dining, fitness, and recreation facilities.',
    description:
      'Includes Mess 1 & 2, student activity lounges, and the indoor sports zone. Evening shuttle services connect the hostels with lecture blocks.',
    latitude: 26.8422,
    longitude: 75.5686,
    imageUrl: null,
  },
];

export const docSources = [
  ...articles.map((article) => ({
    id: `article-${article.slug}`,
    title: article.title,
    source: `article:${article.slug}`,
    content: `${article.title}\n\n${article.body}`,
  })),
  {
    id: 'doc-faqs',
    title: 'Frequently Asked Questions',
    source: 'faq',
    content: faqs
      .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
      .join('\n\n'),
  },
  {
    id: 'doc-events',
    title: 'Campus Events Overview',
    source: 'events',
    content: events
      .map(
        (event) =>
          `${event.title} (${event.location})\n${event.summary}\n${event.description}`,
      )
      .join('\n\n'),
  },
  {
    id: 'doc-pois',
    title: 'Campus Landmarks',
    source: 'pois',
    content: pois
      .map((poi) => `${poi.name}\n${poi.summary}\n${poi.description}`)
      .join('\n\n'),
  },
];

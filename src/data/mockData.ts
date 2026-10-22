import {
  FacultyMember,
  SchoolEvent,
  Course,
  Assignment,
  StudentProfile,
  AttendanceItem,
  SchoolAnnouncement,
  TuitionStatement,
  TeacherResultUploadBatch
} from '../types';

export const SCHOOL_NAME = "St. Andrew's Academy";
export const SCHOOL_MOTTO = "Ad Solem Virtus et Scientia (Virtue and Knowledge Toward the Light)";
export const SCHOOL_FOUNDED = 1903;
export const SCHOOL_ACCREDITATION = "New England Association of Schools and Colleges (NEASC) · International Baccalaureate World School";

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Dr. Arthur Vance',
    title: 'Department Chair & Senior Fellow in Physical Sciences',
    department: 'Sciences & Mathematics',
    email: 'a.vance@standrewsacademy.org',
    officeRoom: 'Franklin Science Hall, Room 304',
    officeHours: 'Mon / Wed 14:00 - 16:30',
    phone: '(555) 843-2010',
    bio: 'Dr. Vance has served on the faculty for 16 years, guiding student research projects recognized at Intel ISEF and the Regeneron Science Talent Search. His focus combines analytical mechanics with computational fluid dynamics.',
    education: ['Ph.D. Applied Physics, Harvard University', 'B.S. Physics with Honors, MIT'],
    coursesTaught: ['AP Physics C: Mechanics', 'AP Physics C: Electricity & Magnetism', 'Advanced Topics in Quantum Theory'],
    consultationAvailable: true,
    avatarColor: 'bg-indigo-700'
  },
  {
    id: 'fac-2',
    name: 'Eleanor Sterling, M.A.',
    title: 'Dean of Humanities & AP Capstone Advisor',
    department: 'Humanities & Social Sciences',
    email: 'e.sterling@standrewsacademy.org',
    officeRoom: 'Gildersleeve Hall, Room 212',
    officeHours: 'Tue / Thu 13:30 - 15:30',
    phone: '(555) 843-2022',
    bio: 'Former editor of the New England Classical Review, Eleanor Sterling guides Upper School scholars in rhetorical analysis, constitutional jurisprudence, and classical philosophy.',
    education: ['M.A. English Literature, Oxford University', 'B.A. Classics & History, Columbia University'],
    coursesTaught: ['AP English Literature & Composition', 'Constitutional Law & Civil Rights', 'Classical Rhetoric Seminar'],
    consultationAvailable: true,
    avatarColor: 'bg-emerald-800'
  },
  {
    id: 'fac-3',
    name: 'Dr. Hiroshi Tanaka',
    title: 'Director of Advanced Mathematics & Robotics',
    department: 'Sciences & Mathematics',
    email: 'h.tanaka@standrewsacademy.org',
    officeRoom: 'Franklin Science Hall, Room 210',
    officeHours: 'Wed / Fri 10:00 - 12:00',
    phone: '(555) 843-2035',
    bio: 'Dr. Tanaka mentors the Academy Math Olympiad and VEX Robotics varsity squads. He specializes in differential topology, algorithms, and applied machine learning curricula.',
    education: ['Ph.D. Mathematics, Princeton University', 'M.Sc. Computer Engineering, Tokyo Institute of Technology'],
    coursesTaught: ['Multivariable Calculus & Linear Algebra', 'Differential Equations', 'Robotics Engineering Lab'],
    consultationAvailable: true,
    avatarColor: 'bg-sky-800'
  },
  {
    id: 'fac-4',
    name: 'Helena Rostov, M.M.',
    title: 'Director of Instrumental Music & Master of Orchestra',
    department: 'Fine & Performing Arts',
    email: 'h.rostov@standrewsacademy.org',
    officeRoom: 'Chamber Hall of Performing Arts, Room 102',
    officeHours: 'Mon / Thu 15:00 - 17:00',
    phone: '(555) 843-2041',
    bio: 'Principal cellist with the Boston Chamber Soloists before joining St. Andrew\'s, Maestro Rostov directs the Symphony Orchestra, String Quartet ensembles, and AP Music Theory.',
    education: ['M.M. Cello Performance & Conducting, The Juilliard School', 'B.M. Eastman School of Music'],
    coursesTaught: ['Symphony Orchestra', 'Chamber Strings Masterclass', 'AP Music Theory'],
    consultationAvailable: true,
    avatarColor: 'bg-amber-800'
  },
  {
    id: 'fac-5',
    name: 'Dr. Gabriela Morales',
    title: 'Head of World Languages & International Exchange',
    department: 'World Languages',
    email: 'g.morales@standrewsacademy.org',
    officeRoom: 'Language Pavillion, Room 114',
    officeHours: 'Tue / Fri 14:00 - 16:00',
    phone: '(555) 843-2053',
    bio: 'Specialist in Iberian linguistics and Latin American literature. Dr. Morales coordinates the Academy\'s annual study abroad fellowships in Madrid and Buenos Aires.',
    education: ['Ph.D. Romance Languages, University of Salamanca', 'B.A. Hispanic Studies, Georgetown University'],
    coursesTaught: ['AP Spanish Literature & Culture', 'Hispanic Cultural Seminar', 'Comparative Romance Philology'],
    consultationAvailable: true,
    avatarColor: 'bg-rose-800'
  },
  {
    id: 'fac-6',
    name: 'Coach Marcus Vance-Brody',
    title: 'Athletic Director & Head Coach of Varsity Crew',
    department: 'Athletics & Physical Education',
    email: 'm.vancebrody@standrewsacademy.org',
    officeRoom: 'Athletics Pavilion & Boathouse, Room 18',
    officeHours: 'Mon - Fri 11:00 - 13:00',
    phone: '(555) 843-2068',
    bio: 'Marcus competed at the World Rowing Championships and has led St. Andrew\'s Crew to four consecutive New England Interscholastic Championships. He advocates for student-athlete well-being and lifelong conditioning.',
    education: ['M.S. Exercise Physiology, Springfield College', 'B.A. Kinesiology, Dartmouth College'],
    coursesTaught: ['Varsity Rowing & Conditioning', 'Kinesiology & Sports Biomechanics', 'Leadership in Athletics'],
    consultationAvailable: false,
    avatarColor: 'bg-teal-800'
  },
  {
    id: 'fac-7',
    name: 'Dr. Beatrice Thorne',
    title: 'Director of Molecular Biology & Organic Synthesis',
    department: 'Sciences & Mathematics',
    email: 'b.thorne@standrewsacademy.org',
    officeRoom: 'Franklin Science Hall, Room 318',
    officeHours: 'Tue / Thu 11:30 - 13:30',
    phone: '(555) 843-2074',
    bio: 'Author of peer-reviewed articles on CRISPR-Cas gene expression mechanisms. Dr. Thorne leads the Academy\'s biotechnology wet lab and ethics in genetic engineering symposium.',
    education: ['Ph.D. Biochemistry, Yale University', 'B.S. Molecular Biophysics, Johns Hopkins'],
    coursesTaught: ['AP Biology & Molecular Genetics', 'Organic Chemistry Honors', 'Independent Research Practicum'],
    consultationAvailable: true,
    avatarColor: 'bg-purple-900'
  },
  {
    id: 'fac-8',
    name: 'Julian Montgomery, M.F.A.',
    title: 'Chair of Studio Arts & Digital Media',
    department: 'Fine & Performing Arts',
    email: 'j.montgomery@standrewsacademy.org',
    officeRoom: 'Visual Arts Wing, Studio C',
    officeHours: 'Mon / Wed 13:00 - 15:00',
    phone: '(555) 843-2081',
    bio: 'Practicing visual artist whose works have been exhibited in New York and London. Julian mentors students preparing portfolios for top art schools and architectural faculties worldwide.',
    education: ['M.F.A. Painting & Printmaking, Rhode Island School of Design', 'B.F.A. Pratt Institute'],
    coursesTaught: ['AP Studio Art: Drawing & 2D Design', 'Oil Painting Masterclass', 'Architectural Drafting & Spatial Design'],
    consultationAvailable: true,
    avatarColor: 'bg-stone-700'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-1',
    title: 'Fall Symphony Orchestra & Chamber Choir Gala',
    description: 'An evening featuring Dvořák\'s New World Symphony and choral works by Whitacre performed by St. Andrew\'s Academy Philharmonic in the timber auditorium.',
    category: 'arts',
    date: '2026-10-24',
    time: '19:30 - 21:30',
    location: 'Chamber Concert Hall, Main Stage',
    building: 'Fine Arts Pavilion',
    organizer: 'Department of Performing Arts',
    rsvpCount: 284,
    userRsvpd: true,
    isPublic: true,
    targetAudience: 'all'
  },
  {
    id: 'evt-2',
    title: 'Varsity Crew Regatta vs. Deerfield & Phillips Exeter',
    description: 'Annual fall invitational rowing dual on Quinsigamond River. Spectator tent with academy refreshments, alumni lounge, and team march.',
    category: 'athletics',
    date: '2026-10-28',
    time: '09:00 - 14:00',
    location: 'Lake Quinsigamond Boathouse Pier',
    building: 'Athletic Waterfront',
    organizer: 'Athletics Department',
    rsvpCount: 142,
    userRsvpd: false,
    isPublic: true,
    targetAudience: 'all'
  },
  {
    id: 'evt-3',
    title: 'Midterm Examination Period (Term I)',
    description: 'Upper and Middle School formal examination schedule. Morning sessions commence at 08:30; afternoon sessions at 13:15.',
    category: 'academic',
    date: '2026-11-02',
    time: '08:30 - 16:00',
    location: 'Memorial Great Hall & Exam Suites',
    building: 'Central Quadrangle',
    organizer: 'Academic Dean\'s Office',
    rsvpCount: 650,
    userRsvpd: false,
    isPublic: false,
    targetAudience: 'students'
  },
  {
    id: 'evt-4',
    title: 'Annual Parent-Faculty Consultations & Dinner',
    description: 'Individual 15-minute consultations with subject advisors followed by the Head of School Address and autumn harvest dinner in the refectory.',
    category: 'pta',
    date: '2026-11-06',
    time: '16:00 - 21:00',
    location: 'Academic Classrooms & Dining Refectory',
    building: 'Main Quad & Commons',
    organizer: 'Parent Association & Academic Office',
    rsvpCount: 390,
    userRsvpd: true,
    isPublic: false,
    targetAudience: 'parents'
  },
  {
    id: 'evt-5',
    title: 'Admissions Open House for Prospective Families',
    description: 'Comprehensive campus tour led by student ambassadors, faculty meet-and-greet in the Science Atrium, and financial aid seminar with Dean of Admissions.',
    category: 'admissions',
    date: '2026-11-14',
    time: '10:00 - 14:30',
    location: 'Welcome Center & Campus Quadrangle',
    building: 'Admissions Center',
    organizer: 'Office of Enrollment & Admissions',
    rsvpCount: 175,
    userRsvpd: false,
    isPublic: true,
    targetAudience: 'all'
  },
  {
    id: 'evt-6',
    title: 'STEM Innovation Symposium & Senior Thesis Presentations',
    description: 'Capstones in robotics, biotechnology, quantum computing, and sustainable energy presented by the Class of 2027 to guest university faculty judges.',
    category: 'academic',
    date: '2026-11-20',
    time: '13:00 - 17:00',
    location: 'Franklin Science Hall Auditorium',
    building: 'Science & Engineering Complex',
    organizer: 'Natural Sciences Faculty',
    rsvpCount: 210,
    userRsvpd: false,
    isPublic: true,
    targetAudience: 'all'
  },
  {
    id: 'evt-7',
    title: 'Community Service Day: Regional Food Bank & Forestry',
    description: 'All-academy civic action day. Bus transport departing from Bell Court at 08:30 for urban food pantries, state park trail maintenance, and literacy tutoring.',
    category: 'community',
    date: '2026-11-25',
    time: '08:30 - 15:00',
    location: 'Assembly at Bell Court',
    building: 'Campus Perimeter',
    organizer: 'Student Council & Chaplaincy',
    rsvpCount: 520,
    userRsvpd: true,
    isPublic: false,
    targetAudience: 'students'
  },
  {
    id: 'evt-8',
    title: 'Holiday Candlelight Festival of Nine Lessons and Carols',
    description: 'Centennial tradition in the historic stone Academy Chapel featuring the Academy Chorale, brass fanfare, and organ voluntaries. All families welcome.',
    category: 'arts',
    date: '2026-12-11',
    time: '18:30 - 20:30',
    location: 'The Memorial Chapel',
    building: 'Heritage Quadrangle',
    organizer: 'Choral Department',
    rsvpCount: 460,
    userRsvpd: true,
    isPublic: true,
    targetAudience: 'all'
  }
];

export const STUDENT_PROFILE: StudentProfile = {
  id: 'stu-10928',
  name: 'Liam Montgomery',
  studentId: 'SA-2027-449',
  grade: 'Grade 11 (Junior Scholar)',
  gpa: 3.94,
  advisor: 'Dr. Arthur Vance',
  attendanceRate: 98.4,
  email: 'l.montgomery27@students.standrewsacademy.org',
  counselor: 'Dr. Sarah Higgins, College Placement',
  creditsEarned: 18.5,
  creditsRequired: 24.0
};

export const STUDENT_COURSES: Course[] = [
  {
    id: 'crs-1',
    code: 'PHYS-401',
    name: 'AP Physics C: Mechanics',
    department: 'Sciences & Mathematics',
    instructor: 'Dr. Arthur Vance',
    instructorId: 'fac-1',
    room: 'Science Hall 304',
    schedule: 'Mon / Wed / Fri 08:45 - 09:55',
    credits: 1.0,
    currentGrade: 96.2,
    letterGrade: 'A',
    announcementsCount: 3
  },
  {
    id: 'crs-2',
    code: 'MATH-450',
    name: 'Multivariable Calculus & Differential Forms',
    department: 'Sciences & Mathematics',
    instructor: 'Dr. Hiroshi Tanaka',
    instructorId: 'fac-3',
    room: 'Science Hall 210',
    schedule: 'Tue / Thu 09:00 - 10:30',
    credits: 1.0,
    currentGrade: 94.8,
    letterGrade: 'A',
    announcementsCount: 1
  },
  {
    id: 'crs-3',
    code: 'ENG-320',
    name: 'AP English Literature & Composition',
    department: 'Humanities & Social Sciences',
    instructor: 'Eleanor Sterling, M.A.',
    instructorId: 'fac-2',
    room: 'Gildersleeve 212',
    schedule: 'Mon / Wed / Fri 10:15 - 11:25',
    credits: 1.0,
    currentGrade: 91.5,
    letterGrade: 'A-',
    announcementsCount: 2
  },
  {
    id: 'crs-4',
    code: 'HIST-305',
    name: 'Constitutional Law & Civil Rights',
    department: 'Humanities & Social Sciences',
    instructor: 'Eleanor Sterling, M.A.',
    instructorId: 'fac-2',
    room: 'Gildersleeve 212',
    schedule: 'Mon / Wed 13:00 - 14:15',
    credits: 1.0,
    currentGrade: 95.0,
    letterGrade: 'A',
    announcementsCount: 1
  },
  {
    id: 'crs-5',
    code: 'MUS-210',
    name: 'Chamber Symphony & Masterclass',
    department: 'Fine & Performing Arts',
    instructor: 'Helena Rostov, M.M.',
    instructorId: 'fac-4',
    room: 'Chamber Hall 102',
    schedule: 'Tue / Thu 14:00 - 15:30',
    credits: 0.5,
    currentGrade: 99.0,
    letterGrade: 'A+',
    announcementsCount: 4
  },
  {
    id: 'crs-6',
    code: 'SPAN-302',
    name: 'AP Spanish Literature & Cultural Seminar',
    department: 'World Languages',
    instructor: 'Dr. Gabriela Morales',
    instructorId: 'fac-5',
    room: 'Language Pavillion 114',
    schedule: 'Tue / Thu / Fri 11:45 - 12:45',
    credits: 1.0,
    currentGrade: 89.8,
    letterGrade: 'B+',
    announcementsCount: 2
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-101',
    courseCode: 'PHYS-401',
    courseName: 'AP Physics C: Mechanics',
    title: 'Laboratory Practicum: Rotational Dynamics & Moment of Inertia',
    dueDate: '2026-10-26',
    totalPoints: 100,
    status: 'pending',
    instructions: 'Submit your 6-page lab report including error propagation tables, Python curve-fitting plots, and analysis of asymmetric cylinder rotational deceleration.'
  },
  {
    id: 'asg-102',
    courseCode: 'ENG-320',
    courseName: 'AP English Literature & Composition',
    title: 'Critical Exegesis: Narrative Framing in Wuthering Heights',
    dueDate: '2026-10-29',
    totalPoints: 50,
    status: 'pending',
    instructions: '1,500 words analyzing Lockwood and Nelly Dean as competing unreliable narrators. MLA format with minimum of three scholarly secondary sources.'
  },
  {
    id: 'asg-103',
    courseCode: 'MATH-450',
    courseName: 'Multivariable Calculus',
    title: 'Problem Set 7: Green\'s Theorem and Line Integrals',
    dueDate: '2026-10-22',
    totalPoints: 40,
    earnedPoints: 40,
    status: 'graded',
    instructions: 'Problems 1-12 from Chapter 16.2. Show complete parametric derivations for closed piecewise smooth curves.',
    submittedAt: '2026-10-21 14:20',
    submittedNote: 'Calculus_PS7_Montgomery.pdf',
    feedback: 'Flawless execution on the circulation density proofs. Exemplary parametric boundary sketches.'
  },
  {
    id: 'asg-104',
    courseCode: 'HIST-305',
    courseName: 'Constitutional Law',
    title: 'Moot Court Brief: Commerce Clause & Federalism Limits',
    dueDate: '2026-10-18',
    totalPoints: 100,
    earnedPoints: 94,
    status: 'graded',
    instructions: 'Petitioner brief addressing modern digital commerce jurisdiction under Article I, Section 8 precedents.',
    submittedAt: '2026-10-17 21:05',
    submittedNote: 'MootBrief_CommerceClause_Final.docx',
    feedback: 'Sharp statutory deconstruction. Consider bolstering footnote citations regarding modern telecommunications jurisprudence.'
  },
  {
    id: 'asg-105',
    courseCode: 'SPAN-302',
    courseName: 'AP Spanish Literature',
    title: 'Ensayo Crítico: El realismo mágico en García Márquez',
    dueDate: '2026-11-03',
    totalPoints: 60,
    status: 'pending',
    instructions: 'Ensayo analítico de 1.200 palabras sobre el tratamiento del tiempo circular en Crónica de una muerte anunciada.'
  }
];

export const INITIAL_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Six Academy Scholars Named 2027 National Merit Semifinalists',
    date: '2026-10-19',
    category: 'Academics',
    urgent: false,
    author: 'Office of the Head of School',
    content: 'We celebrate our six juniors and seniors whose outstanding scores on the PSAT/NMSQT place them among the top 1% of secondary school scholars nationwide. A formal reception will be held this Thursday in the Library Study.'
  },
  {
    id: 'ann-2',
    title: 'Library Hours Extended for Term I Midterm Prep',
    date: '2026-10-18',
    category: 'Student Life',
    urgent: false,
    author: 'Archival Library Staff',
    content: 'Starting Monday, October 26, the Sterling Memorial Library will remain open until 23:00 Monday through Thursday. Peer tutoring desks for AP Sciences and Mathematics will operate from 19:00 to 21:30.'
  },
  {
    id: 'ann-3',
    title: 'Advisory: Scheduled Campus Power Grid Maintenance',
    date: '2026-10-17',
    category: 'Campus Alert',
    urgent: true,
    author: 'Campus Facilities Operations',
    content: 'On Saturday, October 25 from 06:00 to 09:00 AM, backup generator switchgear testing will take place. Academic wireless access points may briefly restart. Dormitory power remains fully continuous.'
  },
  {
    id: 'ann-4',
    title: 'Model United Nations Team Secures Best Delegation at Harvard Conference',
    date: '2026-10-14',
    category: 'Arts & Athletics',
    urgent: false,
    author: 'Faculty Advisor Eleanor Sterling',
    content: 'The St. Andrew\'s MUN Delegation represented France and Japan with distinction across five crisis committees, bringing home the Best Large Delegation gavel and four individual commendations.'
  }
];

export const RECENT_ATTENDANCE: AttendanceItem[] = [
  { date: '2026-10-21', period: 'Period 1 (08:45)', subject: 'AP Physics C', status: 'Present' },
  { date: '2026-10-21', period: 'Period 2 (10:15)', subject: 'AP English Literature', status: 'Present' },
  { date: '2026-10-21', period: 'Period 3 (13:00)', subject: 'Constitutional Law', status: 'Present' },
  { date: '2026-10-20', period: 'Period 1 (09:00)', subject: 'Multivariable Calculus', status: 'Present' },
  { date: '2026-10-20', period: 'Period 2 (11:45)', subject: 'AP Spanish Literature', status: 'Present' },
  { date: '2026-10-20', period: 'Period 3 (14:00)', subject: 'Chamber Symphony', status: 'Present' },
  { date: '2026-10-19', period: 'Period 1 (08:45)', subject: 'AP Physics C', status: 'Present' },
  { date: '2026-10-19', period: 'Period 2 (10:15)', subject: 'AP English Literature', status: 'Present' },
  { date: '2026-10-16', period: 'Period 2 (10:15)', subject: 'AP English Literature', status: 'Excused' }
];

export const TUITION_STATEMENT: TuitionStatement = {
  term: 'Academic Year 2026–2027 (Term II)',
  tuitionTotal: 34500,
  scholarshipAid: 12000,
  paidAmount: 18500,
  balanceDue: 4000,
  dueDate: '2026-11-15',
  status: 'Pending Installment',
  invoices: [
    {
      id: 'INV-2026-0881',
      description: 'Term I Comprehensive Tuition & Laboratory Fee',
      amount: 18500,
      date: '2026-08-15',
      status: 'Paid'
    },
    {
      id: 'INV-2026-1102',
      description: 'Term II Installment (Boarding & Academic Services)',
      amount: 4000,
      date: '2026-10-01',
      status: 'Open'
    }
  ]
};

export const QUICK_STATS = [
  { label: 'College Matriculation', value: '100%', detail: 'Top-tier Ivy, NESCAC, & global universities' },
  { label: 'Student-to-Faculty Ratio', value: '8 : 1', detail: 'Average class size of 12 scholars' },
  { label: 'Advanced Placement & IB', value: '38', detail: 'Rigorous honors, AP, and post-AP electives' },
  { label: 'Annual Merit & Aid', value: '$4.2M', detail: 'Need-blind admissions commitment' }
];

export const ACADEMIC_DIVISIONS = [
  {
    name: 'Lower School (Grades K–5)',
    subtitle: 'Foundation of Inquiry & Wonder',
    description: 'Nurturing intellectual curiosity, joyful discovery, foundational literacy, and Singapore math through immersive outdoor exploration and project laboratories.',
    highlights: ['Bilingual language introduction (French & Spanish)', 'Maker & natural sciences laboratory', 'Daily instrumental and choral foundations']
  },
  {
    name: 'Middle School (Grades 6–8)',
    subtitle: 'Expanding Rigor & Character',
    description: 'Developing independent thought, disciplined writing, collaborative robotics, and empathetic global citizenship during formative adolescent years.',
    highlights: ['Harkness method seminar introductions', 'VEX Robotics & coding sequence', 'Advisory mentorship & athletic participation']
  },
  {
    name: 'Upper School (Grades 9–12)',
    subtitle: 'Scholarly Excellence & University Preparation',
    description: 'A pre-collegiate curriculum offering 38 Advanced Placement and post-AP honors courses, faculty-mentored senior research theses, and world-class arts.',
    highlights: ['Post-AP Multivariable Calculus & Quantum Mechanics', 'Senior Capstone & Fellowship Program', 'Dedicated 4-year College Counseling Office']
  }
];

export const DEFAULT_SITE_SETTINGS = {
  schoolName: "St. Andrew's Academy",
  motto: "Ad Solem Virtus et Scientia (Virtue and Knowledge Toward the Light)",
  foundedYear: 1903,
  heroHeadline: "Cultivating Intellect, Character, and Purpose.",
  heroSubtitle: "St. Andrew's Academy prepares curious minds for rigorous collegiate scholarship and ethical leadership. Guided by an 8:1 student-to-faculty ratio, our students pursue truth across 38 advanced disciplines, classical arts, and competitive athletics.",
  termName: "Fall Term 2026",
  admissionsDeadline: "January 15, 2027",
  visitingHours: "Mon–Sat 09:00–16:00",
  campusAddress: "1903 Academy Quadrangle, Worcester County, MA 01609",
  phone: "(555) 843-2000",
  emergencyPhone: "(555) 843-2911",
  topRibbonAlert: "Fall Symphony Gala this Saturday →",
  accreditationText: "New England Association of Schools and Colleges (NEASC) · International Baccalaureate (IB) World Continuum"
};

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    applicantName: 'Julian Croft',
    gradeLevel: 'Grade 9 (Upper School Freshman)',
    parentName: 'Sarah & David Croft',
    parentEmail: 's.croft@familyoffice.com',
    inquiryNotes: 'Julian is an accomplished violist and state science fair medalist. Inquiring regarding Upper School boarding availability and financial aid for 2027 entry.',
    status: 'new' as const,
    submittedAt: '2026-10-21 09:14'
  },
  {
    id: 'inq-102',
    applicantName: 'Evelyn Zhao',
    gradeLevel: 'Grade 6 (Middle School)',
    parentName: 'Dr. Katherine Zhao',
    parentEmail: 'kzhao@genomics.org',
    inquiryNotes: 'Transferring from San Francisco due to university faculty relocation. Seeking information on Harkness seminar curriculum and robotics club.',
    status: 'tour-scheduled' as const,
    submittedAt: '2026-10-19 15:40'
  },
  {
    id: 'inq-103',
    applicantName: 'Marcus Bradley Jr.',
    gradeLevel: 'Grade 10 (Upper School Sophomore)',
    parentName: 'Marcus Bradley Sr.',
    parentEmail: 'mbradley@capitalholdings.com',
    inquiryNotes: 'Competitive rower (coxswain) and Model UN delegate. Requesting boathouse facility tour and consultation with Coach Vance-Brody.',
    status: 'contacted' as const,
    submittedAt: '2026-10-18 11:22'
  }
];

export const INITIAL_STUDENT_RECORDS = [
  {
    id: 'stu-101',
    name: 'Liam Montgomery',
    studentId: 'SA-2027-449',
    grade: 'Grade 11',
    division: 'Upper School' as const,
    dateOfBirth: '2009-04-12',
    enrollmentStatus: 'Active' as const,
    gpa: 3.94,
    attendanceRate: 98.4,
    advisor: 'Dr. Arthur Vance',
    parentGuardian: 'Eleanor & Robert Montgomery',
    parentEmail: 'e.montgomery@venture.com',
    emergencyPhone: '(555) 321-9844',
    tuitionBalance: 4000,
    medicalNotes: 'Mild asthma (inhaler on file at infirmary). No dietary allergies.',
    enrolledCourses: ['PHYS-401', 'MATH-450', 'ENG-320', 'HIST-305', 'MUS-210', 'SPAN-302'],
    idCardMockupUrl: '/src/assets/images/student_id_liam_1792630513061.jpg'
  },
  {
    id: 'stu-102',
    name: 'Claire Kensington',
    studentId: 'SA-2027-104',
    grade: 'Grade 11',
    division: 'Upper School' as const,
    dateOfBirth: '2009-08-25',
    enrollmentStatus: 'Active' as const,
    gpa: 3.91,
    attendanceRate: 99.1,
    advisor: 'Eleanor Sterling, M.A.',
    parentGuardian: 'Dr. William & Victoria Kensington',
    parentEmail: 'kensington.v@biomed.org',
    emergencyPhone: '(555) 489-1120',
    tuitionBalance: 0,
    medicalNotes: 'EpiPen for severe peanut/tree nut allergy.',
    enrolledCourses: ['PHYS-401', 'ENG-320', 'HIST-305', 'SPAN-302'],
    idCardMockupUrl: '/src/assets/images/student_id_cordelia_1792630515573.jpg'
  },
  {
    id: 'stu-103',
    name: 'Marcus Sterling',
    studentId: 'SA-2027-319',
    grade: 'Grade 11',
    division: 'Upper School' as const,
    dateOfBirth: '2009-02-18',
    enrollmentStatus: 'Active' as const,
    gpa: 3.82,
    attendanceRate: 96.5,
    advisor: 'Dr. Hiroshi Tanaka',
    parentGuardian: 'Thomas Sterling',
    parentEmail: 't.sterling@lawfirm.com',
    emergencyPhone: '(555) 884-9021',
    tuitionBalance: 1200,
    medicalNotes: 'No known health restrictions or allergies.',
    enrolledCourses: ['PHYS-401', 'MATH-450', 'HIST-305'],
    idCardMockupUrl: '/src/assets/images/student_id_badge_card_1792630517398.jpg'
  },
  {
    id: 'stu-104',
    name: 'Sophia Al-Mansoor',
    studentId: 'SA-2026-088',
    grade: 'Grade 12',
    division: 'Upper School' as const,
    dateOfBirth: '2008-11-04',
    enrollmentStatus: 'Active' as const,
    gpa: 4.00,
    attendanceRate: 99.5,
    advisor: 'Dr. Beatrice Thorne',
    parentGuardian: 'Farid & Leila Al-Mansoor',
    parentEmail: 'almansoor.f@architecture.org',
    emergencyPhone: '(555) 902-3314',
    tuitionBalance: 0,
    medicalNotes: 'Clear medical history.',
    enrolledCourses: ['PHYS-401', 'MATH-450', 'ENG-320'],
    idCardMockupUrl: '/src/assets/images/student_id_sophia_1792630517080.jpg'
  },
  {
    id: 'stu-105',
    name: 'Benjamin Vance-Hayes',
    studentId: 'SA-2028-212',
    grade: 'Grade 10',
    division: 'Upper School' as const,
    dateOfBirth: '2010-06-19',
    enrollmentStatus: 'Active' as const,
    gpa: 3.75,
    attendanceRate: 95.8,
    advisor: 'Coach Marcus Vance-Brody',
    parentGuardian: 'Diana Hayes',
    parentEmail: 'diana.hayes@partners.com',
    emergencyPhone: '(555) 712-4099',
    tuitionBalance: 2500,
    medicalNotes: 'Concussion protocol completed spring 2026 (cleared for varsity crew).',
    enrolledCourses: ['ENG-320', 'SPAN-302']
  },
  {
    id: 'stu-106',
    name: 'Ananya Sharma',
    studentId: 'SA-2029-501',
    grade: 'Grade 9',
    division: 'Upper School' as const,
    dateOfBirth: '2011-03-14',
    enrollmentStatus: 'Active' as const,
    gpa: 3.96,
    attendanceRate: 98.9,
    advisor: 'Julian Montgomery, M.F.A.',
    parentGuardian: 'Rajesh & Sunita Sharma',
    parentEmail: 'r.sharma@consulting.com',
    emergencyPhone: '(555) 410-8273',
    tuitionBalance: 0,
    medicalNotes: 'Lactose intolerance.',
    enrolledCourses: ['MUS-210', 'SPAN-302']
  },
  {
    id: 'stu-107',
    name: 'Alexander Dubois',
    studentId: 'SA-2031-118',
    grade: 'Grade 7',
    division: 'Middle School' as const,
    dateOfBirth: '2013-09-08',
    enrollmentStatus: 'Active' as const,
    gpa: 3.88,
    attendanceRate: 97.4,
    advisor: 'Dr. Gabriela Morales',
    parentGuardian: 'Jean-Luc Dubois',
    parentEmail: 'jldubois@global.fr',
    emergencyPhone: '(555) 604-1922',
    tuitionBalance: 1500,
    medicalNotes: 'None.',
    enrolledCourses: ['SPAN-302', 'MUS-210']
  },
  {
    id: 'stu-108',
    name: 'Maya Lin-Peterson',
    studentId: 'SA-2033-042',
    grade: 'Grade 5',
    division: 'Lower School' as const,
    dateOfBirth: '2015-12-11',
    enrollmentStatus: 'Active' as const,
    gpa: 3.92,
    attendanceRate: 99.0,
    advisor: 'Helena Rostov, M.M.',
    parentGuardian: 'Peter & Cheryl Lin-Peterson',
    parentEmail: 'clinpeterson@design.com',
    emergencyPhone: '(555) 303-8819',
    tuitionBalance: 0,
    medicalNotes: 'Mild seasonal pollen allergy.',
    enrolledCourses: ['MUS-210']
  }
];

export const INITIAL_STAFF_RECORDS = [
  {
    id: 'stf-1',
    name: 'Dr. Arthur Vance',
    staffId: 'FAC-014',
    role: 'Chair & Senior Fellow, Physical Sciences',
    department: 'Sciences & Mathematics',
    email: 'a.vance@standrewsacademy.org',
    phone: '(555) 843-2010',
    assignedCourses: ['PHYS-401', 'PHYS-402'],
    teachingPeriodsPerWeek: 18,
    status: 'Active' as const
  },
  {
    id: 'stf-2',
    name: 'Eleanor Sterling, M.A.',
    staffId: 'FAC-022',
    role: 'Dean of Humanities & Capstone Director',
    department: 'Humanities & Social Sciences',
    email: 'e.sterling@standrewsacademy.org',
    phone: '(555) 843-2022',
    assignedCourses: ['ENG-320', 'HIST-305'],
    teachingPeriodsPerWeek: 16,
    status: 'Active' as const
  },
  {
    id: 'stf-3',
    name: 'Dr. Hiroshi Tanaka',
    staffId: 'FAC-035',
    role: 'Director of Advanced Mathematics',
    department: 'Sciences & Mathematics',
    email: 'h.tanaka@standrewsacademy.org',
    phone: '(555) 843-2035',
    assignedCourses: ['MATH-450'],
    teachingPeriodsPerWeek: 15,
    status: 'Active' as const
  },
  {
    id: 'stf-4',
    name: 'Helena Rostov, M.M.',
    staffId: 'FAC-041',
    role: 'Director of Instrumental Music',
    department: 'Fine & Performing Arts',
    email: 'h.rostov@standrewsacademy.org',
    phone: '(555) 843-2041',
    assignedCourses: ['MUS-210'],
    teachingPeriodsPerWeek: 14,
    status: 'Active' as const
  },
  {
    id: 'stf-5',
    name: 'Dr. Gabriela Morales',
    staffId: 'FAC-053',
    role: 'Head of World Languages',
    department: 'World Languages',
    email: 'g.morales@standrewsacademy.org',
    phone: '(555) 843-2053',
    assignedCourses: ['SPAN-302'],
    teachingPeriodsPerWeek: 15,
    status: 'Active' as const
  }
];

export const INITIAL_FEE_INVOICES = [
  {
    id: 'INV-2026-8801',
    studentId: 'SA-2027-449',
    studentName: 'Liam Montgomery',
    description: 'Term I Comprehensive Academic Tuition',
    amount: 18500,
    dueDate: '2026-08-15',
    status: 'Paid' as const,
    term: 'Term I 2026',
    paidDate: '2026-08-10'
  },
  {
    id: 'INV-2026-8802',
    studentId: 'SA-2027-449',
    studentName: 'Liam Montgomery',
    description: 'Term II Installment (Boarding & Science Lab Fee)',
    amount: 4000,
    dueDate: '2026-11-15',
    status: 'Unpaid' as const,
    term: 'Term II 2026'
  },
  {
    id: 'INV-2026-8803',
    studentId: 'SA-2027-319',
    studentName: 'Marcus Sterling',
    description: 'Robotics Engineering & Lab Consumables Fee',
    amount: 1200,
    dueDate: '2026-10-30',
    status: 'Unpaid' as const,
    term: 'Term I 2026'
  },
  {
    id: 'INV-2026-8804',
    studentId: 'SA-2028-212',
    studentName: 'Benjamin Vance-Hayes',
    description: 'Fall Interscholastic Crew Boathouse Equipment Fee',
    amount: 2500,
    dueDate: '2026-10-15',
    status: 'Overdue' as const,
    term: 'Term I 2026'
  },
  {
    id: 'INV-2026-8805',
    studentId: 'SA-2031-118',
    studentName: 'Alexander Dubois',
    description: 'Middle School Outdoor Experiential Education Trip',
    amount: 1500,
    dueDate: '2026-11-01',
    status: 'Unpaid' as const,
    term: 'Term I 2026'
  }
];

export const INITIAL_TIMETABLE_SLOTS = [
  { id: 'tt-1', day: 'Monday' as const, period: '08:45 - 09:55', courseCode: 'PHYS-401', courseName: 'AP Physics C: Mechanics', instructor: 'Dr. Arthur Vance', room: 'Science Hall 304' },
  { id: 'tt-2', day: 'Monday' as const, period: '10:15 - 11:25', courseCode: 'ENG-320', courseName: 'AP English Literature', instructor: 'Eleanor Sterling, M.A.', room: 'Gildersleeve 212' },
  { id: 'tt-3', day: 'Monday' as const, period: '13:00 - 14:15', courseCode: 'HIST-305', courseName: 'Constitutional Law', instructor: 'Eleanor Sterling, M.A.', room: 'Gildersleeve 212' },
  { id: 'tt-4', day: 'Tuesday' as const, period: '09:00 - 10:30', courseCode: 'MATH-450', courseName: 'Multivariable Calculus', instructor: 'Dr. Hiroshi Tanaka', room: 'Science Hall 210' },
  { id: 'tt-5', day: 'Tuesday' as const, period: '11:45 - 12:45', courseCode: 'SPAN-302', courseName: 'AP Spanish Literature', instructor: 'Dr. Gabriela Morales', room: 'Language Pav. 114' },
  { id: 'tt-6', day: 'Tuesday' as const, period: '14:00 - 15:30', courseCode: 'MUS-210', courseName: 'Chamber Symphony Masterclass', instructor: 'Helena Rostov, M.M.', room: 'Chamber Hall 102' },
  { id: 'tt-7', day: 'Wednesday' as const, period: '08:45 - 09:55', courseCode: 'PHYS-401', courseName: 'AP Physics C: Mechanics Lab', instructor: 'Dr. Arthur Vance', room: 'Science Hall 304' },
  { id: 'tt-8', day: 'Wednesday' as const, period: '10:15 - 11:25', courseCode: 'ENG-320', courseName: 'Harkness Rhetoric Seminar', instructor: 'Eleanor Sterling, M.A.', room: 'Gildersleeve 212' },
  { id: 'tt-9', day: 'Thursday' as const, period: '09:00 - 10:30', courseCode: 'MATH-450', courseName: 'Differential Forms & Topology', instructor: 'Dr. Hiroshi Tanaka', room: 'Science Hall 210' },
  { id: 'tt-10', day: 'Friday' as const, period: '08:45 - 09:55', courseCode: 'PHYS-401', courseName: 'AP Physics Problem Solving', instructor: 'Dr. Arthur Vance', room: 'Science Hall 304' },
  { id: 'tt-11', day: 'Friday' as const, period: '14:00 - 16:00', courseCode: 'CREW-101', courseName: 'Varsity Interscholastic Regatta Practice', instructor: 'Coach Marcus Vance-Brody', room: 'Waterfront Boathouse' }
];

export const INITIAL_RESULT_BATCHES: TeacherResultUploadBatch[] = [
  {
    id: 'batch-01',
    teacherId: 'fac-1',
    teacherName: 'Dr. Arthur Vance',
    courseCode: 'PHYS-401',
    courseName: 'AP Physics C: Mechanics',
    term: 'Fall Term 2026',
    assessmentTitle: 'Midterm Examination: Analytical Mechanics & Rotational Dynamics',
    assessmentType: 'Midterm Exam',
    uploadedAt: '2026-10-18',
    averageScore: 95.8,
    highestScore: 98.0,
    lowestScore: 93.5,
    passCount: 3,
    totalStudents: 3,
    status: 'Published',
    records: [
      {
        studentId: 'SA-2027-014',
        studentName: 'Liam Montgomery',
        score: 96.0,
        letterGrade: 'A',
        remarks: 'Exemplary mathematical derivations on non-inertial reference frames.'
      },
      {
        studentId: 'SA-2027-042',
        studentName: 'Cordelia Sterling',
        score: 93.5,
        letterGrade: 'A',
        remarks: 'Strong conceptual grasp of conservation of angular momentum.'
      },
      {
        studentId: 'SA-2026-088',
        studentName: 'Sophia Al-Mansoor',
        score: 98.0,
        letterGrade: 'A+',
        remarks: 'Flawless calculation on coupled oscillator systems. Top score.'
      }
    ]
  },
  {
    id: 'batch-02',
    teacherId: 'fac-2',
    teacherName: 'Eleanor Sterling, M.A.',
    courseCode: 'ENG-320',
    courseName: 'AP English Literature & Composition',
    term: 'Fall Term 2026',
    assessmentTitle: 'Term Paper: The Rhetoric of Authority in Classical Tragedies',
    assessmentType: 'Coursework Project',
    uploadedAt: '2026-10-15',
    averageScore: 92.4,
    highestScore: 95.0,
    lowestScore: 88.0,
    passCount: 3,
    totalStudents: 3,
    status: 'Published',
    records: [
      {
        studentId: 'SA-2027-014',
        studentName: 'Liam Montgomery',
        score: 92.0,
        letterGrade: 'A-',
        remarks: 'Insightful textual analysis; lucid synthesis of historical context.'
      },
      {
        studentId: 'SA-2026-088',
        studentName: 'Sophia Al-Mansoor',
        score: 95.0,
        letterGrade: 'A',
        remarks: 'Mature analytical prose; compelling thesis defense.'
      },
      {
        studentId: 'SA-2028-212',
        studentName: 'Benjamin Vance-Hayes',
        score: 88.0,
        letterGrade: 'B+',
        remarks: 'Solid thesis; recommended deeper engagement with primary sources.'
      }
    ]
  },
  {
    id: 'batch-03',
    teacherId: 'fac-3',
    teacherName: 'Dr. Hiroshi Tanaka',
    courseCode: 'MATH-450',
    courseName: 'Multivariable Calculus & Differential Forms',
    term: 'Fall Term 2026',
    assessmentTitle: 'Term Examination I: Surface Integrals & Stokes Theorem',
    assessmentType: 'Term Assessment',
    uploadedAt: '2026-10-12',
    averageScore: 94.7,
    highestScore: 97.0,
    lowestScore: 92.0,
    passCount: 3,
    totalStudents: 3,
    status: 'Published',
    records: [
      {
        studentId: 'SA-2027-014',
        studentName: 'Liam Montgomery',
        score: 95.0,
        letterGrade: 'A',
        remarks: 'Rigorous application of Green and Stokes theorems.'
      },
      {
        studentId: 'SA-2027-042',
        studentName: 'Cordelia Sterling',
        score: 92.0,
        letterGrade: 'A-',
        remarks: 'Good computational steps; watch multi-dimensional vector signs.'
      },
      {
        studentId: 'SA-2026-088',
        studentName: 'Sophia Al-Mansoor',
        score: 97.0,
        letterGrade: 'A+',
        remarks: 'Impeccable differential manifold proofs. Outstanding mastery.'
      }
    ]
  }
];




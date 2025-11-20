/**
 * Seed data for Events Collection
 * 
 * To import this data to Appwrite:
 * 1. Go to your Appwrite Console
 * 2. Navigate to Databases → Your Database → events collection
 * 3. Click "Create Document"
 * 4. Copy and paste each event object below
 * 
 * Or use the Appwrite SDK to bulk import
 */

export const seedEvents = [
  {
    title: "Expert Talk by Coding Thinker",
    description: "An engaging talk session covering the fundamentals of competitive programming and problem-solving strategies. Learn from industry experts about the best practices in coding and algorithmic thinking.",
    startDate: "2025-08-26T10:00:00.000Z",
    endDate: "2025-08-26T11:30:00.000Z",
    location: "College Campus - Main Auditorium",
    posterUrl: "",
    status: "Scheduled",
    slug: "expert-talk-coding-thinker",
    type: "Talk",
    gallery: []
  },
  {
    title: "DSPL Session",
    description: "Introduction to Data Science Programming Logic. A comprehensive session covering Python basics, data structures, and essential libraries for data science.",
    startDate: "2025-09-10T10:00:00.000Z",
    endDate: "2025-09-10T12:00:00.000Z",
    location: "College Campus - Computer Lab 2",
    posterUrl: "https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing",
    status: "Scheduled",
    slug: "dspl-session",
    type: "Session",
    gallery: []
  },
  {
    title: "DSPL Workshop",
    description: "Hands-on 2-day workshop diving deep into Python libraries like NumPy, Pandas, Matplotlib, and Seaborn. Learn data manipulation, visualization, and analysis techniques with real-world datasets.",
    startDate: "2025-09-11T10:00:00.000Z",
    endDate: "2025-09-12T17:00:00.000Z",
    location: "College Campus - Computer Lab 1 & 2",
    posterUrl: "https://drive.google.com/file/d/1xv3a9iCzqhP2mRNXrXFPtc2MdO4triam/view?usp=sharing",
    status: "Scheduled",
    slug: "dspl-workshop",
    type: "Workshop",
    gallery: []
  },
  {
    title: "APTIFY Test",
    description: "Challenge your aptitude skills in this comprehensive test covering quantitative reasoning, logical thinking, number series, and analytical problem-solving. Top performers will receive certificates.",
    startDate: "2025-10-13T10:00:00.000Z",
    endDate: "2025-10-13T11:00:00.000Z",
    location: "College Campus - Examination Hall",
    posterUrl: "https://drive.google.com/file/d/1yEwEA1owqbw1So4HH01FjJaeSejo5XMo/view?usp=drive_link",
    status: "Scheduled",
    slug: "aptify-test",
    type: "Test",
    gallery: []
  },
  {
    title: "Intro to Machine Learning",
    description: "A beginner-friendly workshop covering Python basics and fundamental ML concepts. Learn about supervised learning, model training, and practical applications of machine learning.",
    startDate: "2025-11-25T10:00:00.000Z",
    endDate: "2025-11-25T14:00:00.000Z",
    location: "Computer Lab 1",
    posterUrl: "",
    status: "Scheduled",
    slug: "intro-to-machine-learning",
    type: "Workshop",
    gallery: []
  },
  {
    title: "AI Innovation Hackathon",
    description: "24-hour intensive coding battle to build innovative GenAI solutions. Form teams, solve real-world problems, and compete for prizes worth ₹10,000. Mentorship and resources provided.",
    startDate: "2025-12-10T09:00:00.000Z",
    endDate: "2025-12-11T09:00:00.000Z",
    location: "Main Auditorium & Computer Labs",
    posterUrl: "",
    status: "Scheduled",
    slug: "ai-innovation-hackathon",
    type: "Hackathon",
    gallery: []
  },
  {
    title: "Guest Lecture: Future of AI",
    description: "An interactive session with industry experts discussing the ethics, challenges, and future scope of Artificial Intelligence. Learn about career opportunities and emerging trends in AI.",
    startDate: "2025-12-20T11:00:00.000Z",
    endDate: "2025-12-20T13:00:00.000Z",
    location: "Seminar Hall B",
    posterUrl: "",
    status: "Scheduled",
    slug: "guest-lecture-future-of-ai",
    type: "Guest Lecture",
    gallery: []
  },
  {
    title: "Club Orientation 2025",
    description: "Welcome session for new members! Meet the Core Council, learn about club activities, upcoming events, and opportunities. Get acquainted with fellow AI/ML enthusiasts.",
    startDate: "2025-11-22T15:00:00.000Z",
    endDate: "2025-11-22T17:00:00.000Z",
    location: "OCT Campus Lawns",
    posterUrl: "",
    status: "Scheduled",
    slug: "club-orientation-2025",
    type: "Orientation",
    gallery: []
  }
];

/**
 * Instructions for importing:
 * 
 * Method 1 - Manual Import:
 * Copy each object above and create documents manually in Appwrite Console
 * 
 * Method 2 - SDK Import (Node.js script):
 * 
 * ```javascript
 * const sdk = require('node-appwrite');
 * 
 * const client = new sdk.Client()
 *   .setEndpoint('https://cloud.appwrite.io/v1')
 *   .setProject('your_project_id')
 *   .setKey('your_api_key');
 * 
 * const databases = new sdk.Databases(client);
 * 
 * async function importEvents() {
 *   for (const event of seedEvents) {
 *     await databases.createDocument(
 *       'your_database_id',
 *       'events',
 *       sdk.ID.unique(),
 *       event
 *     );
 *   }
 * }
 * 
 * importEvents();
 * ```
 */

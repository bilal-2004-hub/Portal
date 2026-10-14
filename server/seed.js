const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const User = require('./models/User');
const connectDB = require('./config/database');

dotenv.config();

const seedCourses = [
  {
    title: 'Data Structures and Algorithms',
    description: 'Understand arrays, linked lists, stacks, queues, trees, graphs and algorithm design techniques essential for CS problem solving.',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    instructor: 'Dr. Amina Hassan',
    category: 'Core CS',
    type: 'Core',
    difficulty: 'Intermediate',
    duration: '8 Weeks',
    lessons: 20,
    learningOutcomes: ['Analyze time complexity', 'Implement common data structures', 'Solve algorithmic challenges'],
    requirements: ['Basic programming knowledge'],
  },
  {
    title: 'Operating Systems',
    description: 'Learn process management, memory management, scheduling, synchronization and the fundamentals of operating systems.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    instructor: 'Prof. Usman Ali',
    category: 'Core CS',
    type: 'Core',
    difficulty: 'Advanced',
    duration: '7 Weeks',
    lessons: 18,
    learningOutcomes: ['Understand OS architecture', 'Manage processes and threads', 'Study memory and scheduling'],
    requirements: ['Computer fundamentals'],
  },
  {
    title: 'Database Management Systems',
    description: 'Study relational databases, normalization, SQL queries, transaction management and database design principles.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    instructor: 'Sarah Ahmed',
    category: 'Database',
    type: 'Core',
    difficulty: 'Intermediate',
    duration: '6 Weeks',
    lessons: 16,
    learningOutcomes: ['Write complex SQL queries', 'Design normalized schemas', 'Understand transactions and indexing'],
    requirements: ['Basic programming and logic'],
  },
  {
    title: 'Computer Networks',
    description: 'Explore network layers, protocols, routing, IP addressing and real-world communication systems used in computer networks.',
    thumbnail: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80',
    instructor: 'Engr. Ahmed Raza',
    category: 'Networking',
    type: 'Core',
    difficulty: 'Intermediate',
    duration: '5 Weeks',
    lessons: 14,
    learningOutcomes: ['Understand OSI and TCP/IP', 'Configure networking basics', 'Analyze routing and communication'],
    requirements: ['Basic understanding of systems'],
  },
  {
    title: 'Object-Oriented Programming',
    description: 'Master classes, objects, inheritance, polymorphism, encapsulation and OOP design using C++ or Java.',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    instructor: 'Mahad Qureshi',
    category: 'Programming',
    type: 'Core',
    difficulty: 'Beginner',
    duration: '6 Weeks',
    lessons: 15,
    learningOutcomes: ['Design object-oriented systems', 'Use inheritance and polymorphism', 'Write reusable software modules'],
    requirements: ['Intro to programming'],
  },
  {
    title: 'Artificial Intelligence and Machine Learning',
    description: 'Learn AI foundations, supervised learning, model evaluation, and practical ML workflows for real-world problem solving.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    instructor: 'Dr. Hania Qadri',
    category: 'AI & ML',
    type: 'Elective',
    difficulty: 'Advanced',
    duration: '7 Weeks',
    lessons: 18,
    learningOutcomes: ['Understand ML pipelines', 'Train and evaluate models', 'Apply AI to real use cases'],
    requirements: ['Linear algebra basics and Python'],
  },
  {
    title: 'Entrepreneurship and Startup Management',
    description: 'Explore startup ideas, business planning, product validation, funding basics, and leadership for launching ventures.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    instructor: 'Ms. Zainab Tariq',
    category: 'Business',
    type: 'Elective',
    difficulty: 'Intermediate',
    duration: '6 Weeks',
    lessons: 15,
    learningOutcomes: ['Build a startup mindset', 'Create business models', 'Evaluate customer demand and growth'],
    requirements: ['Open mind for entrepreneurship'],
  },
  {
    title: 'Principles of Marketing',
    description: 'Understand customer behavior, branding, positioning, digital marketing, and campaign planning for modern businesses.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    instructor: 'Ali Hassan',
    category: 'Marketing',
    type: 'Elective',
    difficulty: 'Beginner',
    duration: '5 Weeks',
    lessons: 12,
    learningOutcomes: ['Analyze market segments', 'Design promotional strategies', 'Use branding and positioning effectively'],
    requirements: ['Basic communication skills'],
  },
  {
    title: 'Introduction to Political Science',
    description: 'Study political systems, governance, public policy, citizenship, and the role of institutions in society.',
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80',
    instructor: 'Dr. Saad Mahmood',
    category: 'Social Sciences',
    type: 'Elective',
    difficulty: 'Beginner',
    duration: '4 Weeks',
    lessons: 10,
    learningOutcomes: ['Understand political institutions', 'Analyze governance and policy', 'Discuss civic and public issues'],
    requirements: ['Interest in social and political systems'],
  },
];

const shuffleOptions = (options) => {
  const copied = [...options];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
};

const withShuffledOptions = (question) => ({
  ...question,
  options: shuffleOptions(question.options),
});

const createQuizForCourse = (course) => {
  const questionBank = {
    'Data Structures and Algorithms': [
      { question: 'Which data structure follows the FIFO principle?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 'Queue' },
      { question: 'What is the time complexity of binary search on a sorted array?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'], correctAnswer: 'O(log n)' },
      { question: 'Which traversal method visits the root node before its children in a tree?', options: ['Post-order', 'In-order', 'Pre-order', 'Level-order'], correctAnswer: 'Pre-order' },
      { question: 'Which of the following is a linear data structure?', options: ['Queue', 'Binary Tree', 'Graph', 'Heap'], correctAnswer: 'Queue' },
      { question: 'A linked list is best described as a collection of?', options: ['Nodes connected by pointers', 'Fixed-size arrays', 'Hash buckets', 'Queues only'], correctAnswer: 'Nodes connected by pointers' },
      { question: 'Which algorithmic approach solves a problem by breaking it into smaller overlapping subproblems?', options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'], correctAnswer: 'Dynamic Programming' },
      { question: 'Which operation is most efficient for a stack?', options: ['Random access by index', 'Push and pop from the top', 'Sorting by value', 'Merging two trees'], correctAnswer: 'Push and pop from the top' },
      { question: 'What does Big O notation mainly describe?', options: ['Memory size only', 'Execution time or complexity trend', 'Code readability', 'Input formatting'], correctAnswer: 'Execution time or complexity trend' },
      { question: 'Which graph representation stores adjacency lists for each vertex?', options: ['Hash Map only', 'Array of edges', 'Adjacency list', 'Binary tree'], correctAnswer: 'Adjacency list' },
      { question: 'Which is the best case for quicksort when pivot selection is ideal?', options: ['O(n^2)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(n log n)' },
    ],
    'Operating Systems': [
      { question: 'The operating system is responsible for managing which of the following?', options: ['Processes', 'Memory', 'Files', 'All of the above'], correctAnswer: 'All of the above' },
      { question: 'What is a process?', options: ['A running program instance', 'A CPU register', 'A storage device', 'A database table'], correctAnswer: 'A running program instance' },
      { question: 'Which scheduling algorithm is based on the shortest execution time first?', options: ['Round Robin', 'FCFS', 'SJF', 'Priority Scheduling'], correctAnswer: 'SJF' },
      { question: 'Deadlock occurs when processes are waiting for?', options: ['A faster CPU', 'Shared resources that are never released', 'Higher memory', 'User input'], correctAnswer: 'Shared resources that are never released' },
      { question: 'Which component of an OS handles communication between hardware and software?', options: ['Kernel', 'Compiler', 'Browser', 'Database'], correctAnswer: 'Kernel' },
      { question: 'Virtual memory helps the system by?', options: ['Increasing CPU speed', 'Extending RAM using disk space', 'Deleting old files', 'Reducing network latency'], correctAnswer: 'Extending RAM using disk space' },
      { question: 'Which OS concept allows multiple processes to share CPU time?', options: ['Multitasking', 'Compiling', 'Indexing', 'Encryption'], correctAnswer: 'Multitasking' },
      { question: 'Which of the following is a synchronization primitive?', options: ['Semaphore', 'Queue', 'Array', 'Graph'], correctAnswer: 'Semaphore' },
      { question: 'The file system is primarily responsible for?', options: ['Executing JavaScript', 'Storing and organizing files', 'Managing network packets', 'Creating user interfaces'], correctAnswer: 'Storing and organizing files' },
      { question: 'Which type of memory is closest to the CPU and fastest?', options: ['Hard disk', 'RAM', 'Cache', 'SSD'], correctAnswer: 'Cache' },
    ],
    'Database Management Systems': [
      { question: 'Which SQL command is used to retrieve records from a database?', options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'], correctAnswer: 'SELECT' },
      { question: 'What is the purpose of a primary key?', options: ['To store duplicate entries', 'To uniquely identify each row', 'To optimize memory', 'To sort files'], correctAnswer: 'To uniquely identify each row' },
      { question: 'Normalization is used to reduce?', options: ['Data redundancy', 'Query speed', 'CPU load', 'Server cost'], correctAnswer: 'Data redundancy' },
      { question: 'Which join returns rows that match in both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correctAnswer: 'INNER JOIN' },
      { question: 'A transaction in a database is?', options: ['A single SQL statement only', 'A logical unit of database work', 'A backup file', 'A replication server'], correctAnswer: 'A logical unit of database work' },
      { question: 'Which of the following is a DDL command?', options: ['SELECT', 'CREATE', 'INSERT', 'UPDATE'], correctAnswer: 'CREATE' },
      { question: 'What does indexing improve in a database?', options: ['Query performance', 'Power consumption', 'Network routing', 'User interface'], correctAnswer: 'Query performance' },
      { question: 'Which integrity rule ensures that a foreign key refers to an existing row?', options: ['Entity integrity', 'Referential integrity', 'Domain integrity', 'Logical integrity'], correctAnswer: 'Referential integrity' },
      { question: 'What is the result of GROUP BY in SQL?', options: ['It groups rows by common values', 'It deletes rows', 'It creates indexes', 'It updates data types'], correctAnswer: 'It groups rows by common values' },
      { question: 'Which command changes existing records in a table?', options: ['UPDATE', 'ALTER', 'DROP', 'CREATE'], correctAnswer: 'UPDATE' },
    ],
    'Computer Networks': [
      { question: 'Which layer of the OSI model is primarily responsible for routing?', options: ['Application', 'Transport', 'Network', 'Data Link'], correctAnswer: 'Network' },
      { question: 'What does IP stand for in networking?', options: ['Internet Protocol', 'Internal Program', 'Input Path', 'Internet Packet'], correctAnswer: 'Internet Protocol' },
      { question: 'Which protocol is used to transfer web pages over the internet?', options: ['FTP', 'HTTP', 'SMTP', 'SSH'], correctAnswer: 'HTTP' },
      { question: 'A switch normally operates at which OSI layer?', options: ['Application', 'Transport', 'Data Link', 'Physical'], correctAnswer: 'Data Link' },
      { question: 'Which address uniquely identifies a device on a network?', options: ['MAC address', 'URL', 'Username', 'Domain name'], correctAnswer: 'MAC address' },
      { question: 'Which device connects different networks together?', options: ['Hub', 'Switch', 'Router', 'Repeater'], correctAnswer: 'Router' },
      { question: 'TCP is considered?', options: ['Connectionless and unreliable', 'Connection-oriented and reliable', 'A physical layer protocol', 'Only for email'], correctAnswer: 'Connection-oriented and reliable' },
      { question: 'What is the purpose of DNS?', options: ['To route packets', 'To resolve domain names to IP addresses', 'To send emails', 'To compress files'], correctAnswer: 'To resolve domain names to IP addresses' },
      { question: 'Which topology connects all devices to a central hub?', options: ['Mesh', 'Star', 'Ring', 'Bus'], correctAnswer: 'Star' },
      { question: 'Which protocol is used for sending email?', options: ['SMTP', 'HTTP', 'TCP', 'UDP'], correctAnswer: 'SMTP' },
    ],
    'Object-Oriented Programming': [
      { question: 'Which OOP concept allows a class to inherit properties from another class?', options: ['Abstraction', 'Inheritance', 'Encapsulation', 'Polymorphism'], correctAnswer: 'Inheritance' },
      { question: 'What is encapsulation?', options: ['Hiding implementation details and exposing behavior', 'Copying methods', 'Creating loops', 'Defining variables globally'], correctAnswer: 'Hiding implementation details and exposing behavior' },
      { question: 'Which concept allows one method name to behave differently based on object type?', options: ['Polymorphism', 'Compilation', 'Indexing', 'Recursion'], correctAnswer: 'Polymorphism' },
      { question: 'An object is an instance of a?', options: ['Method', 'Class', 'Library', 'Loop'], correctAnswer: 'Class' },
      { question: 'Which access modifier usually restricts access to the same class only?', options: ['Public', 'Protected', 'Private', 'Static'], correctAnswer: 'Private' },
      { question: 'Which principle means hiding complexity behind a simple interface?', options: ['Abstraction', 'Inheritance', 'Overloading', 'Looping'], correctAnswer: 'Abstraction' },
      { question: 'What is method overloading?', options: ['Using multiple methods with the same name and different parameters', 'Deleting methods', 'Calling a parent class method', 'Importing modules'], correctAnswer: 'Using multiple methods with the same name and different parameters' },
      { question: 'Which keyword is used to create a class in Java?', options: ['new', 'class', 'create', 'object'], correctAnswer: 'class' },
      { question: 'What is the main purpose of constructors?', options: ['To destroy objects', 'To initialize object state', 'To print output', 'To define constants'], correctAnswer: 'To initialize object state' },
      { question: 'Which relationship describes a class using another class without inheritance?', options: ['Association', 'Polymorphism', 'Recursion', 'Pointer'], correctAnswer: 'Association' },
    ],
    'Artificial Intelligence and Machine Learning': [
      { question: 'What is machine learning primarily about?', options: ['Writing programs manually', 'Learning patterns from data', 'Managing hardware', 'Encrypting files'], correctAnswer: 'Learning patterns from data' },
      { question: 'Which of the following is a supervised learning task?', options: ['Clustering', 'Classification', 'Anomaly detection', 'Dimensionality reduction'], correctAnswer: 'Classification' },
      { question: 'What does a model use to learn during training?', options: ['Data labels and features', 'Only hardware logs', 'Only random guesses', 'Static HTML'], correctAnswer: 'Data labels and features' },
      { question: 'What is the purpose of feature selection?', options: ['To remove irrelevant attributes', 'To increase noise', 'To compile code', 'To connect routers'], correctAnswer: 'To remove irrelevant attributes' },
      { question: 'Which metric is commonly used to evaluate classification models?', options: ['Accuracy', 'Bandwidth', 'Latency', 'Storage'], correctAnswer: 'Accuracy' },
      { question: 'Overfitting happens when a model?', options: ['Performs well on training data but poorly on new data', 'Never learns', 'Uses too little memory', 'Runs on one CPU core'], correctAnswer: 'Performs well on training data but poorly on new data' },
      { question: 'Which algorithm is commonly used for clustering?', options: ['K-Means', 'BFS', 'QuickSort', 'MergeSort'], correctAnswer: 'K-Means' },
      { question: 'The training dataset is used to?', options: ['Teach the model patterns', 'Delete old files', 'Assign IP addresses', 'Create loops'], correctAnswer: 'Teach the model patterns' },
      { question: 'What is a label in supervised learning?', options: ['A target value for prediction', 'A hardware port', 'A database schema', 'A network packet'], correctAnswer: 'A target value for prediction' },
      { question: 'Which step is part of the ML workflow after training?', options: ['Evaluation', 'Printing the source code', 'Dropping the database', 'Restarting the server'], correctAnswer: 'Evaluation' },
    ],
    'Entrepreneurship and Startup Management': [
      { question: 'What is a startup most commonly known for?', options: ['A large corporation', 'A newly launched business trying to validate an idea', 'A government office', 'A coding language'], correctAnswer: 'A newly launched business trying to validate an idea' },
      { question: 'What is a business model?', options: ['A plan for how a company creates and captures value', 'A hardware specification', 'A website theme', 'A database schema'], correctAnswer: 'A plan for how a company creates and captures value' },
      { question: 'Why is customer validation important?', options: ['To ensure there is demand for the product', 'To reduce code complexity', 'To buy more hardware', 'To write legal contracts'], correctAnswer: 'To ensure there is demand for the product' },
      { question: 'Which factor is critical for a startup pitch?', options: ['Strong value proposition', 'Extra CPU power', 'Longer code', 'Larger database'], correctAnswer: 'Strong value proposition' },
      { question: 'What does MVP stand for?', options: ['Minimum Viable Product', 'Most Valuable Program', 'Marketing Value Proposal', 'Major Venture Plan'], correctAnswer: 'Minimum Viable Product' },
      { question: 'Which metric helps track user growth?', options: ['Revenue', 'Conversion rate', 'CPU temperature', 'IP speed'], correctAnswer: 'Conversion rate' },
      { question: 'What is the purpose of market research?', options: ['To understand customer needs and market trends', 'To create database tables', 'To write documentation only', 'To manage routers'], correctAnswer: 'To understand customer needs and market trends' },
      { question: 'Which source is commonly used for startup funding?', options: ['Angel investors', 'Graphics card drivers', 'Operating system updates', 'Database backups'], correctAnswer: 'Angel investors' },
      { question: 'A value proposition explains?', options: ['Why customers choose a product or service', 'How to set up a server', 'The syntax of a programming language', 'How to design a circuit'], correctAnswer: 'Why customers choose a product or service' },
      { question: 'Which skill is essential for startup leadership?', options: ['Decision making', 'Operating a printer', 'Replacing hardware', 'Downloading files'], correctAnswer: 'Decision making' },
    ],
    'Principles of Marketing': [
      { question: 'What is marketing primarily concerned with?', options: ['Selling products only', 'Understanding and satisfying customer needs', 'Writing code', 'Maintaining servers'], correctAnswer: 'Understanding and satisfying customer needs' },
      { question: 'Which concept refers to dividing the market into groups with similar needs?', options: ['Segmentation', 'Sorting', 'Indexing', 'Routing'], correctAnswer: 'Segmentation' },
      { question: 'What is branding?', options: ['Creating a unique identity and perception for a product', 'A technical configuration', 'A database query', 'A network protocol'], correctAnswer: 'Creating a unique identity and perception for a product' },
      { question: 'What does positioning mean in marketing?', options: ['How a product is perceived in the minds of customers', 'The physical installation of software', 'The database architecture', 'The layout of a server room'], correctAnswer: 'How a product is perceived in the minds of customers' },
      { question: 'Which of the following is a common digital marketing channel?', options: ['Email marketing', 'Hard disk routing', 'Compiler configuration', 'File compression'], correctAnswer: 'Email marketing' },
      { question: 'What is a target market?', options: ['The specific group of customers a business aims to serve', 'The user manual of a product', 'A software testing tool', 'The marketing budget only'], correctAnswer: 'The specific group of customers a business aims to serve' },
      { question: 'Which element is part of the 4Ps of marketing?', options: ['Product', 'Processor', 'Protocol', 'Packet'], correctAnswer: 'Product' },
      { question: 'Customer behavior analysis helps marketers understand?', options: ['Why customers buy and how they decide', 'How to patch hardware', 'How to optimize CPU speed', 'How to design a database'], correctAnswer: 'Why customers buy and how they decide' },
      { question: 'What is promotional strategy?', options: ['A plan to communicate value to customers', 'A system for storing files', 'A process for compiling code', 'A technique for wiring circuits'], correctAnswer: 'A plan to communicate value to customers' },
      { question: 'Which statement best defines market research?', options: ['Collecting and analyzing information about consumers and competitors', 'Writing software documentation', 'Sending network packets', 'Creating database records'], correctAnswer: 'Collecting and analyzing information about consumers and competitors' },
    ],
    'Introduction to Political Science': [
      { question: 'What is politics mainly concerned with?', options: ['The distribution and use of power in society', 'Computer hardware setup', 'Software installation', 'Website design'], correctAnswer: 'The distribution and use of power in society' },
      { question: 'Which term describes the system of government and institutions in a state?', options: ['Political system', 'Data system', 'Network system', 'Operating system'], correctAnswer: 'Political system' },
      { question: 'What is citizenship?', options: ['Legal membership in a political community with rights and duties', 'A database user account', 'A software package', 'A network route'], correctAnswer: 'Legal membership in a political community with rights and duties' },
      { question: 'Public policy refers to?', options: ['Government decisions and actions to address public issues', 'A website policy', 'A code of ethics for programmers', 'A server configuration'], correctAnswer: 'Government decisions and actions to address public issues' },
      { question: 'What is democracy?', options: ['Government by the people, usually through elected representatives', 'A type of computer network', 'A web framework', 'A marketing model'], correctAnswer: 'Government by the people, usually through elected representatives' },
      { question: 'Which institution is usually responsible for making laws?', options: ['Legislature', 'Operating system', 'Router', 'Compiler'], correctAnswer: 'Legislature' },
      { question: 'What is the purpose of political institutions?', options: ['To organize and regulate power and governance', 'To manage server traffic', 'To create marketing plans', 'To store binary data'], correctAnswer: 'To organize and regulate power and governance' },
      { question: 'What does governance mean?', options: ['How power is exercised in managing public affairs', 'How data is stored on a disk', 'How programs compile', 'How networks transmit data'], correctAnswer: 'How power is exercised in managing public affairs' },
      { question: 'Which concept is central to political participation?', options: ['Voting', 'Sorting arrays', 'Running queries', 'Building networks'], correctAnswer: 'Voting' },
      { question: 'Why is political science important?', options: ['It helps analyze power, institutions, and public policy', 'It manages hardware resources', 'It creates marketing campaigns', 'It errors on network speed'], correctAnswer: 'It helps analyze power, institutions, and public policy' },
    ],
  };

  const questions = questionBank[course.title] || [
    { question: `Which concept is most important in ${course.title}?`, options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'], correctAnswer: 'Concept A' },
    { question: `Which skill is most essential for learning ${course.title}?`, options: ['Analytical thinking', 'Hardware repair', 'Color theory', 'Translation'], correctAnswer: 'Analytical thinking' },
    { question: `Which activity best supports understanding ${course.title}?`, options: ['Practice and application', 'Ignoring the topic', 'Deleting data', 'Skipping class'], correctAnswer: 'Practice and application' },
    { question: `What should a learner do to improve in ${course.title}?`, options: ['Study core concepts and apply them', 'Avoid all exercises', 'Only memorize random words', 'Ignore assignments'], correctAnswer: 'Study core concepts and apply them' },
    { question: `Which statement is true about ${course.title}?`, options: ['It builds practical understanding', 'It has no real-world use', 'It is only for design tasks', 'It avoids problem solving'], correctAnswer: 'It builds practical understanding' },
    { question: `Which approach is most effective in ${course.title}?`, options: ['Consistent study and practice', 'Random guessing', 'Skipping key concepts', 'Avoiding examples'], correctAnswer: 'Consistent study and practice' },
    { question: `What helps learners succeed in ${course.title}?`, options: ['Regular revision and application', 'Ignoring feedback', 'Avoiding questions', 'Memorizing without understanding'], correctAnswer: 'Regular revision and application' },
    { question: `Which learning method is best for ${course.title}?`, options: ['Hands-on exercises', 'Passive reading only', 'No practice', 'Random guessing'], correctAnswer: 'Hands-on exercises' },
    { question: `What is a key goal of ${course.title}?`, options: ['Build understanding and apply knowledge', 'Avoid all feedback', 'Skip practice', 'Limit learning'], correctAnswer: 'Build understanding and apply knowledge' },
    { question: `A strong learner in ${course.title} should focus on?`, options: ['Core principles and practice', 'Only memorizing answers', 'Ignoring mistakes', 'Avoiding challenges'], correctAnswer: 'Core principles and practice' },
  ];

  return {
    courseId: course._id,
    title: `${course.title} Quiz`,
    passingPercentage: 70,
    questions: questions.slice(0, 10).map((question) => withShuffledOptions(question)),
  };
};

const seedDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  const createdCourses = [];
  for (const course of seedCourses) {
    const createdCourse = await Course.findOneAndUpdate(
      { title: course.title },
      { $setOnInsert: course },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    createdCourses.push(createdCourse);
  }

  for (const course of createdCourses) {
    const quizDoc = createQuizForCourse(course);
    await Quiz.findOneAndUpdate(
      { courseId: course._id },
      { $setOnInsert: quizDoc },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  if (process.env.NODE_ENV !== 'production'
    && process.env.SEED_DEMO_USER === 'true'
    && !(await User.exists({ email: 'student@example.com' }))) {
    const demoPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Daniyal',
      email: 'student@example.com',
      passwordHash: demoPassword,
      studentId: 'STU-696277-L2BH',
      phone: '0300-1234567',
      role: 'student',
    });
  }

  console.log('Missing course and quiz seed data inserted; existing records were preserved.');
};

if (require.main === module) {
  seedDatabase()
    .then(() => mongoose.disconnect())
    .catch((error) => {
      console.error('Seed failed:', error.name);
      mongoose.disconnect().finally(() => {
        process.exitCode = 1;
      });
    });
}

module.exports = { seedDatabase };

/*
  Kitaplik ve alinti duvarinin verisi.

  status alani:
    "read"    — okunmus
    "reading" — su an okunuyor
    "next"    — okuma listesinde

  Bu ayrim onemli: okuma listesindeki bir kitap "okudum" iddiasi degil.
  Listeyi kendine gore duzelt — okumadigin bir kitabi "read" birakma.

  Alintilarin hepsi gercek kaynaklarindan; attribution alanina kitabi
  degil sozu gercekten soyleyen kisiyi/eseri yaziyoruz.
*/

export const books = [
  {
    id: "gof",
    title: "Design Patterns",
    subtitle: "Elements of Reusable Object-Oriented Software",
    authors: "Gamma, Helm, Johnson, Vlissides",
    year: "1994",
    status: "read",
    topics: ["OOP", "Architecture", "C++"],
    takeaway:
      "The book that explains why an abstract base class with three concrete children beats a switch statement over a type tag. The CPP modules make you build half of these patterns without naming them — reading it afterwards is when the names arrive.",
    usedIn: ["CPP05-09", "Web_serv-std98-"],
  },
  {
    id: "tlpi",
    title: "The Linux Programming Interface",
    subtitle: "A Linux and UNIX System Programming Handbook",
    authors: "Michael Kerrisk",
    year: "2010",
    status: "read",
    topics: ["Systems", "POSIX", "C"],
    takeaway:
      "Fifteen hundred pages of what the man pages leave out. fork and exec, file descriptors and what they really point at, signal semantics and which functions are safe inside a handler, sockets and poll. Almost every 42 systems project is a chapter of this book with a grade attached.",
    usedIn: ["minishell", "philo", "minitalk", "Web_serv-std98-"],
  },
  {
    id: "knr",
    title: "The C Programming Language",
    subtitle: "Second Edition",
    authors: "Kernighan & Ritchie",
    year: "1988",
    status: "read",
    topics: ["C", "Fundamentals"],
    takeaway:
      "Short, dense, and still the clearest explanation of pointers and arrays being the same idea viewed from two angles. The exercises are the reason libft and ft_printf feel like re-treading familiar ground rather than inventing something.",
    usedIn: ["libft", "ft_printf", "get_next_line"],
  },
  {
    id: "beej",
    title: "Beej's Guide to Network Programming",
    authors: "Brian Hall",
    year: "2020",
    status: "read",
    topics: ["Networking", "Sockets"],
    takeaway:
      "The friendliest path into Berkeley sockets. socket, bind, listen, accept in the right order, why a server needs SO_REUSEADDR, and what non-blocking actually changes about the shape of your loop.",
    usedIn: ["Web_serv-std98-", "netpractice"],
  },
  {
    id: "csapp",
    title: "Computer Systems: A Programmer's Perspective",
    authors: "Bryant & O'Hallaron",
    year: "2015",
    status: "reading",
    topics: ["Systems", "Architecture", "Performance"],
    takeaway:
      "Explains the gap between the code you write and what the machine does with it — cache lines, the memory hierarchy, linking, and why the same algorithm over two containers gives two very different wall clocks.",
    usedIn: ["cpp09", "MiniRT"],
  },
  {
    id: "ostep",
    title: "Operating Systems: Three Easy Pieces",
    authors: "Arpaci-Dusseau",
    year: "2018",
    status: "reading",
    topics: ["OS", "Concurrency"],
    takeaway:
      "Virtualisation, concurrency, persistence — the three pieces. The concurrency chapters are the shortest honest explanation of why a mutex is not a suggestion and why a race condition disappears the moment you try to observe it.",
    usedIn: ["philo", "minishell"],
  },
  {
    id: "pragmatic",
    title: "The Pragmatic Programmer",
    authors: "Hunt & Thomas",
    year: "1999",
    status: "next",
    topics: ["Craft", "Practices"],
    takeaway:
      "On the list for the habits rather than the techniques — DRY, tracer bullets, and not living with broken windows.",
    usedIn: [],
  },
  {
    id: "refactoring",
    title: "Refactoring",
    subtitle: "Improving the Design of Existing Code",
    authors: "Martin Fowler",
    year: "2018",
    status: "next",
    topics: ["Design", "Craft"],
    takeaway:
      "Next up, for the discipline of changing structure without changing behaviour — and a catalogue of the moves that do it safely.",
    usedIn: [],
  },
  {
    id: "sicp",
    title: "Structure and Interpretation of Computer Programs",
    authors: "Abelson & Sussman",
    year: "1996",
    status: "next",
    topics: ["Fundamentals", "Abstraction"],
    takeaway:
      "On the list because everyone who has finished it says it rearranges how you think about abstraction rather than teaching a language.",
    usedIn: [],
  },
  {
    id: "mythical",
    title: "The Mythical Man-Month",
    authors: "Frederick P. Brooks Jr.",
    year: "1975",
    status: "next",
    topics: ["Teams", "Project Management"],
    takeaway:
      "Fifty years old and still the reference on why software schedules slip. Relevant the moment a project becomes a team project — which in the cursus is ft_transcendence.",
    usedIn: ["transcendence"],
  },
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    authors: "Martin Kleppmann",
    year: "2017",
    status: "next",
    topics: ["Data", "Distributed Systems"],
    takeaway:
      "The bridge between writing a query and understanding what the database is doing underneath it. Queued after the data analytics work.",
    usedIn: ["salifort-retention"],
  },
];

export const quotes = [
  {
    text: "Program to an interface, not an implementation.",
    attribution: "Design Patterns",
    source: "Gamma, Helm, Johnson & Vlissides, 1994",
    note: "The whole reason an abstract AForm exists instead of three unrelated classes.",
  },
  {
    text: "Favor object composition over class inheritance.",
    attribution: "Design Patterns",
    source: "Gamma, Helm, Johnson & Vlissides, 1994",
    note: "The second principle of the book, and the one that takes longer to believe.",
  },
  {
    text:
      "Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface.",
    attribution: "Doug McIlroy",
    source: "The Unix philosophy, Bell Labs",
    note: "Three sentences that explain why a shell is worth building.",
  },
  {
    text:
      "Programs must be written for people to read, and only incidentally for machines to execute.",
    attribution: "Abelson & Sussman",
    source: "Structure and Interpretation of Computer Programs",
    note: "",
  },
  {
    text:
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    attribution: "Martin Fowler",
    source: "Refactoring",
    note: "",
  },
  {
    text:
      "Everyone knows that debugging is twice as hard as writing a program in the first place. So if you're as clever as you can be when you write it, how will you ever debug it?",
    attribution: "Brian Kernighan",
    source: "The Elements of Programming Style, with P. J. Plauger",
    note: "Worth rereading before writing anything clever in C.",
  },
  {
    text: "Controlling complexity is the essence of computer programming.",
    attribution: "Brian Kernighan",
    source: "Software Tools",
    note: "",
  },
  {
    text: "Premature optimization is the root of all evil.",
    attribution: "Donald Knuth",
    source: "Structured Programming with go to Statements, 1974",
    note: "Usually quoted without the sentence before it, which concedes that the remaining three percent of cases do matter.",
  },
  {
    text: "Adding manpower to a late software project makes it later.",
    attribution: "Fred Brooks",
    source: "The Mythical Man-Month",
    note: "Brooks's law.",
  },
  {
    text: "Don't live with broken windows.",
    attribution: "Hunt & Thomas",
    source: "The Pragmatic Programmer",
    note: "A bad design left in place is permission for the next one.",
  },
];

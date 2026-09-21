import {
  SiC,
  SiCisco,
  SiDebian,
  SiCplusplus,
  SiDocker,
  SiGnubash,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";

/*
  Kart anlatilari burada elle tutulur: GitHub depolarinin hicbirinde
  description/topics alani dolu olmadigi icin baslik, ozet ve etiketler
  API'den gelemiyor. Yildiz, dil ve son guncelleme tarihi ise Projects.js
  icinde canli cekilip buradaki kayitlarla "repo" alani uzerinden eslesir.

  Detay sayfasi once depodaki README'yi GitHub'in render edilmis HTML
  ciktisiyla basmayi dener. README'si olmayan depolar icin asagidaki
  "overview" + "highlights" alanlari kullanilir; bu metinler depolarin
  dosya agaci incelenerek yazildi.

  Her kaydin bir "id" alani var; adres cubugunda /project/<id> olarak
  gorunur. "repo" alani istege bagli: GitHub'da bir deposu olan projeler
  icin depo adiyla birebir ayni olmali (rozetler ve README bununla gelir).
  Deposu olmayan projelerde repo yazilmaz — o zaman kart GitHub butonu
  gostermez ve icerik olarak overview/highlights kullanilir.

  "status" alani kartta bir rozet olarak cikar ("In progress" gibi).
*/

export const categories = [
  { id: "all", label: "All" },
  { id: "42", label: "42 Cursus" },
  { id: "ai", label: "AI" },
  { id: "data", label: "Data" },
  { id: "web", label: "Web" },
];

/*
  Kapak gradyanlari ve ikon renkleri. Hepsi sitenin mor temasiyla ayni
  aileden: ton degisiyor, doygunluk ve parlaklik sabit kaliyor, boylece
  kartlar tek bir set gibi okunuyor. --imp-text-color (#c770f0) bu
  paletin merkezi.
*/
const accent = {
  c: "#9d6ddb",
  cpp: "#8a72e6",
  infra: "#a95fd0",
  web: "#b97ae8",
  ai: "#c770f0",
  data: "#a86fe8",
};

const projects = [
  {
    id: "Google-Bootcamp-Mediscan-AI",
    repo: "Google-Bootcamp-Mediscan-AI",
    title: "MediScan AI",
    category: "ai",
    icon: SiPython,
    accent: accent.ai,
    description:
      "AI powered health platform that recognises medicine from a photo of its box, blister or the pill itself, then rewrites the official leaflet in language anyone can understand.",
    tags: ["Computer Vision", "LLM", "Healthcare"],
  },
  {
    id: "portfolio",
    repo: "portfolio",
    title: "This Portfolio",
    category: "web",
    icon: SiReact,
    accent: accent.web,
    description:
      "The site you are reading. A React single page app deployed to GitHub Pages, with a projects section that reads its own statistics and documentation from the GitHub API at runtime.",
    tags: ["React", "React Router", "Bootstrap", "GitHub API", "GitHub Pages"],
    /*
      "stack" alani detay sayfasinda "Built with" bolumu olarak basilir.
      Sadece kutuphane adi degil, o projede ne ise yaradigi da yaziliyor —
      bir surum listesi, teknoloji secimi hakkinda hicbir sey anlatmaz.
    */
    stack: [
      { name: "React", version: "17", role: "Component model and state" },
      {
        name: "React Router",
        version: "6",
        role: "Client side routing, mounted under a basename for the GitHub Pages subpath",
      },
      {
        name: "Create React App",
        version: "5",
        role: "Build pipeline — webpack 5, Babel and the dev server with hot reload",
      },
      {
        name: "React Bootstrap",
        version: "2",
        role: "Responsive grid and card primitives over Bootstrap 5",
      },
      {
        name: "react-tsparticles",
        role: "The animated starfield behind every page",
      },
      {
        name: "typewriter-effect",
        role: "Rotating role titles in the home page headline",
      },
      {
        name: "react-parallax-tilt",
        role: "Tilt on the avatar that follows the cursor",
      },
      {
        name: "react-github-calendar",
        role: "The contribution heatmap in the Days I Code section",
      },
      {
        name: "react-icons",
        version: "4",
        role: "Simple Icons, Ant Design and Devicons sets — every logo on the site is an SVG component, not an image",
      },
      {
        name: "GitHub REST API",
        role: "Repository statistics and README HTML, fetched at runtime and cached for an hour",
      },
      {
        name: "gh-pages",
        role: "Publishes the production build to the gh-pages branch in one command",
      },
    ],
    overview:
      "Built on Create React App with React 17 and React Router 6. The interesting parts are not the framework choices but the constraints: it is a client side app served from a static host under a subpath, and its content comes from an API with a hard rate limit and no authentication. Most of the engineering below is about those two facts.",
    highlights: [
      {
        title: "Routing on a static host",
        body: "GitHub Pages serves files, not routes, so a refresh on /project/libft would normally 404. The router runs under a basename taken from PUBLIC_URL so every link keeps the /portfolio prefix, and a 404.html redirect hands unknown paths back to index.html with the original path preserved in the query string, which the app then restores. That pair is what makes a deep link shareable.",
      },
      {
        title: "Live data with a hard rate limit",
        body: "The unauthenticated GitHub API allows sixty requests an hour per address. All repository statistics come from a single call that is indexed by name and cached in sessionStorage for an hour, so the list page and every detail page share one request instead of making their own. Browsing four pages costs three requests, and they are all README fetches.",
      },
      {
        title: "Documentation rendered by GitHub",
        body: "Each detail page asks the API for the repository README as rendered HTML rather than raw markdown. No markdown parser is bundled, image paths arrive already absolute, and the output is sanitised on GitHub's side — the styling for headings, code blocks and tables is then written once for the dark theme.",
      },
      {
        title: "Degrading honestly when the API is gone",
        body: "If a request fails the badges simply do not render and the page still works. The failure modes are kept apart on purpose: a 404 means the repository genuinely has no README, anything else means it could not be fetched. Collapsing the two would make the page claim a documented project has no documentation whenever the rate limit ran out.",
      },
      {
        title: "A data driven project registry",
        body: "Every project is one record in a single file — title, summary, tags, category, accent colour, and a written description used when there is no README. Category filters and their counts are derived from that list, so an empty category disappears and a new one appears without touching the component. Projects with no public repository are supported by leaving the repo field out.",
      },
      {
        title: "One palette, not per-brand colours",
        body: "Card covers are generated from a gradient rather than screenshots, and technology logos are tinted to the site's own purple instead of their brand colours. Hue varies a little by category while saturation and lightness stay fixed, which is what lets eighteen cards read as one set.",
      },
      {
        title: "A full screen overlay that swallowed every click",
        body: "The animated particle layer is position fixed at full width and height, so it covered the whole page and absorbed every click beneath it — the category filters did nothing, and the social links on the home page had never worked. Adding pointer-events: none to that layer fixed all of them at once. It also explains why testing by calling .click() in the console is not enough: that path skips hit testing entirely and reports success on a button no user can reach.",
      },
    ],
  },
  {
    id: "salifort-retention",
    title: "Employee Retention Model",
    category: "data",
    icon: SiPython,
    accent: accent.data,
    description:
      "Capstone of the Google Advanced Data Analytics certificate: predicting which employees are about to leave a company, and identifying what is actually driving them out.",
    tags: ["Python", "pandas", "scikit-learn", "Machine Learning", "EDA"],
    status: "No public repo",
    overview:
      "An HR department has a turnover problem and a spreadsheet of roughly fifteen thousand employee records. The brief is not only to predict who leaves, but to say why — a model nobody can act on is worth nothing to the people who asked for it. Worked end to end under the PACE framework the programme teaches: plan the question, analyse the data, construct the model, execute the recommendation.",
    highlights: [
      {
        title: "Exploratory analysis before any model",
        body: "Satisfaction score, last evaluation, project count, average monthly hours, tenure, promotions, department and salary band. The distributions tell most of the story before a model is fitted: the people leaving are not randomly spread, they cluster.",
      },
      {
        title: "Overwork shows up in the data, not just in theory",
        body: "Employees carrying seven projects left without exception, and the hours distribution splits into two peaks — a group working far above a normal month and a disengaged group working well below it. Two different reasons for leaving, visible as two different shapes.",
      },
      {
        title: "Logistic regression as the baseline",
        body: "A linear model first, because a coefficient can be read and explained to a non technical stakeholder. It also sets the bar that any more complex model has to clear to justify its own opacity.",
      },
      {
        title: "Tree ensembles for the real predictions",
        body: "Decision tree, random forest and gradient boosting, tuned with cross validated grid search. They handle the non linear thresholds the linear model cannot — attrition does not rise smoothly with hours, it jumps past a point.",
      },
      {
        title: "Accuracy is the wrong score here",
        body: "Leavers are the minority class, so a model that predicts 'stays' for everyone already scores well on accuracy. Evaluation is done on precision, recall, F1 and AUC instead, and the threshold is chosen around what the business actually pays for — missing someone about to resign costs more than a wasted retention conversation.",
      },
      {
        title: "Catching the leak in the strongest feature",
        body: "Satisfaction score is the most predictive column and also the least trustworthy: it comes from a survey that may not exist at the moment a prediction is needed, and it partly reflects a decision already made. A second model is built without it, to see how much of the performance was real and how much was borrowed from the future.",
      },
      {
        title: "Findings written for the people who asked",
        body: "The deliverable ends in feature importances turned into plain recommendations — cap project load, investigate the overworked tail, review the tenure band where attrition spikes — rather than a notebook and a score.",
      },
    ],
  },
  {
    id: "born2beroot",
    title: "Born2beroot",
    category: "42",
    icon: SiDebian,
    accent: accent.infra,
    description:
      "A hardened Debian server built from a blank virtual machine: encrypted LVM partitions, a strict sudo and password policy, a firewall, a scheduled monitoring script — and, for the bonus, a WordPress site served by lighttpd and MariaDB.",
    tags: ["Linux", "Debian", "LVM", "SSH", "UFW", "Bash", "WordPress"],
    status: "No public repo",
    overview:
      "System administration rather than programming. The machine starts as an empty virtual disk and has to end up as a server that is locked down, partitioned correctly and able to report on its own state — with every choice defensible during the evaluation.",
    highlights: [
      {
        title: "Encrypted LVM partitioning",
        body: "The disk is laid out over LUKS encrypted logical volumes rather than plain partitions, so the layout can be resized later and the data is unreadable without the passphrase.",
      },
      {
        title: "sudo policy and audit trail",
        body: "sudo is configured with a limited number of password attempts, a custom error message, a restricted PATH and full logging of every command to its own directory, so privileged actions leave a trail.",
      },
      {
        title: "Password rules and user groups",
        body: "Expiry periods, minimum length and complexity rules enforced through the password quality library, plus the user and group setup the subject requires.",
      },
      {
        title: "Firewall and SSH",
        body: "UFW allows only what is needed, and SSH listens on port 4242 with root login refused — the two changes that turn a default install into something worth exposing.",
      },
      {
        title: "Monitoring script",
        body: "A shell script that reports architecture, CPU and memory use, disk usage, active connections, the number of users and the last reboot — broadcast to every terminal every ten minutes through cron.",
      },
      {
        title: "Bonus: the full partition scheme",
        body: "Instead of the minimum layout, the disk is split into separate encrypted logical volumes for root, swap, home, var, srv, tmp and var/log. Keeping logs and temporary files on their own volumes means a runaway log or a full /tmp cannot take the whole system down with it.",
      },
      {
        title: "Bonus: WordPress on lighttpd and MariaDB",
        body: "A working WordPress site on a stack the subject chooses deliberately — lighttpd instead of NGINX or Apache, MariaDB for the database, PHP through FastCGI — so the web server has to be configured from its own documentation rather than a familiar tutorial.",
      },
    ],
  },
  {
    id: "netpractice",
    title: "NetPractice",
    category: "42",
    icon: SiCisco,
    accent: accent.infra,
    description:
      "A networking exercise: repair ten broken TCP/IP topologies by working out the addressing, masks and routes each one needs.",
    tags: ["Networking", "TCP/IP", "Subnetting", "Routing"],
    status: "No public repo",
    overview:
      "Ten levels, each a small network drawn on screen that does not work. The task is to read the topology, work out why the packets cannot reach their destination, and fill in the missing addresses, subnet masks and routing table entries. It is solved in a browser rather than in code, which is why there is no repository for it — the output is understanding, not a binary.",
    highlights: [
      {
        title: "Subnet masks decide everything",
        body: "Two hosts can talk directly only if the mask puts them in the same network. Most broken levels come down to one interface whose mask is a bit too wide or too narrow, so an address that looks neighbouring is treated as remote — or worse, silently overlaps a second subnet elsewhere in the diagram.",
      },
      {
        title: "Network and broadcast addresses are not usable",
        body: "The first and last address of every range are reserved. A /30 link between two routers therefore has exactly two usable addresses, which is the whole point of using it there — and assigning one of the reserved pair is a common way a level fails.",
      },
      {
        title: "Routing tables and the default route",
        body: "Each router needs to know where to send traffic that is not local. Sometimes the correct answer is one specific route to one specific network; sometimes it is a default route pointing at the next hop. Adding a default where a specific route is required makes the level pass by accident, which the evaluation looks for.",
      },
      {
        title: "Routes have to work in both directions",
        body: "A reply has to find its way home. Levels that seem correct often fail because only the outbound path was configured and the return path has no route — a reminder that reachability is a property of a pair, not of one host.",
      },
      {
        title: "Switches are invisible at this layer",
        body: "A switch forwards frames without needing an address of its own, so hosts hanging off it must share one subnet. Treating a switch as if it were a router, or expecting it to join two different networks, is a mistake the later levels are built to expose.",
      },
      {
        title: "Diagnosis before configuration",
        body: "Every level fails for one specific reason. Reading the topology and naming the fault first — wrong mask, missing route, overlapping range, unusable address — is faster than trying addresses until the lights turn green, and it is the habit the project is really teaching.",
      },
    ],
  },
  {
    id: "cpp09",
    title: "CPP Module 09",
    category: "42",
    icon: SiCplusplus,
    accent: accent.cpp,
    description:
      "The last C++ module: choosing the right STL container for each problem and paying for that choice in performance.",
    tags: ["C++98", "STL", "Containers", "Algorithms"],
    status: "No public repo",
    overview:
      "Three exercises, each about picking the right container rather than writing one. After four modules spent building classes and templates by hand, the last one hands you the STL and makes the choice of data structure — and the cost of that choice — the actual difficulty. Every exercise must use a different container.",
    highlights: [
      {
        title: "Bitcoin exchange — lookup by nearest earlier date",
        body: "A CSV of historical prices is loaded into a std::map keyed by date, because the query is not 'find this date' but 'find the most recent date at or before this one'. An ordered container answers that with lower_bound in logarithmic time; a hash map cannot answer it at all, which is what makes the container choice the exercise.",
      },
      {
        title: "Input validation is most of the work",
        body: "The input file is deliberately hostile: badly formed dates, dates that do not exist, negative values, values above the allowed maximum, missing separators and empty lines. Each one needs its own message and none of them may abort the run — the program reports the bad line and carries on.",
      },
      {
        title: "Reverse Polish Notation with a stack",
        body: "Tokens are read left to right; operands are pushed and each operator pops two and pushes the result. The interesting part is the failure modes — an operator with too few operands beneath it, leftover operands at the end, division by zero, and tokens that are neither — all of which have to be caught before the expression is evaluated.",
      },
      {
        title: "Ford-Johnson merge insertion sort",
        body: "The final exercise implements merge-insertion sort, which is close to optimal in the number of comparisons it uses. Elements are paired and the larger of each pair sorted recursively, then the smaller ones are inserted into that sorted chain — and crucially the insertion order follows the Jacobsthal sequence, so every insertion lands in a range whose size is a power of two and binary search never wastes a comparison.",
      },
      {
        title: "The same algorithm in two containers",
        body: "The sort is written twice, over two different containers, and the program times both on the same input. The comparison count is identical; the wall clock is not. That gap — contiguous storage and cache behaviour versus chunked storage and cheaper insertion — is the lesson the module ends on.",
      },
      {
        title: "C++98 throughout",
        body: "No auto, no range-based for, no initialiser lists, no unordered containers. Everything is built from iterators and the containers the 1998 standard provides, which is what forces the container choice to be deliberate rather than habitual.",
      },
    ],
  },
  {
    id: "transcendence",
    title: "ft_transcendence",
    category: "42",
    icon: SiTypescript,
    accent: accent.web,
    description:
      "The final project of the common core: a real time multiplayer Pong website with accounts, chat and matchmaking.",
    tags: ["Full Stack", "WebSockets", "Real Time", "Docker"],
    status: "In progress",
    overview:
      "The capstone of the 42 common core, and the only project in it that is a product rather than an exercise. A single page web application where players sign in, chat, challenge each other and play Pong against another person in real time. It is also the first project that is built as a team, which makes the interfaces between parts as important as the parts themselves.",
    highlights: [
      {
        title: "The server owns the game state",
        body: "Ball position, paddle position and score live on the server, which steps the simulation on a fixed tick and broadcasts it. Clients send intent — up, down, stop — and never their own coordinates. Without that rule a player can edit the numbers in their own browser and win every rally, so authority has to sit on one side and it cannot be the client's.",
      },
      {
        title: "Making a fast game survive a slow network",
        body: "A tick arriving late must not make the ball stutter. The client interpolates between the last two states it received rather than waiting, and reconciles when the next authoritative state contradicts what it drew. The gap between what the player sees and what the server believes is the central engineering problem of the whole project.",
      },
      {
        title: "Matchmaking, invitations and spectating",
        body: "Players either queue for an opponent or challenge someone directly from the chat. A game that is in progress can be watched live by others, which means the same state stream has to serve participants and observers without leaking anything a spectator should not have.",
      },
      {
        title: "Chat with real moderation",
        body: "Public, private and password protected channels plus direct messages. Channels have an owner and administrators who can kick, mute for a duration, and ban; users can block each other, which has to hide messages retroactively in a shared channel without deleting them for everyone else.",
      },
      {
        title: "Authentication done properly",
        body: "Sign in through the 42 OAuth provider rather than storing passwords, with two factor authentication on top and sessions that survive a reload without leaving a token somewhere a script can read it.",
      },
      {
        title: "Profiles, history and a ladder",
        body: "Every finished match is recorded, so profiles carry a win/loss record, a match history and a live online/offline/in-game status, and the ladder ranks players against each other.",
      },
      {
        title: "One command to run the whole stack",
        body: "Frontend, backend, database and reverse proxy each in their own container, brought up together by a single docker-compose call — the same discipline Inception covered, applied to a real application instead of a demo.",
      },
    ],
  },
  {
    id: "Web_serv-std98-",
    repo: "Web_serv-std98-",
    title: "Webserv",
    category: "42",
    icon: SiCplusplus,
    accent: accent.cpp,
    description:
      "A non blocking HTTP/1.1 server written from scratch in C++98. Parses its own nginx style config, serves static files, handles CGI and keeps many clients alive on a single event loop.",
    tags: ["C++98", "HTTP", "Sockets", "CGI"],
  },
  {
    id: "CPP05-09",
    repo: "CPP05-09",
    title: "CPP Modules 05-08",
    category: "42",
    icon: SiCplusplus,
    accent: accent.cpp,
    description:
      "The advanced half of the 42 C++ track: exception hierarchies, type casting and serialisation, templates, and finally container and iterator work on top of the STL.",
    tags: ["C++98", "Templates", "STL", "Exceptions"],
    overview:
      "Four modules of the 42 C++ curriculum, each a separate directory of exercises with its own Makefile. The repository covers modules 05 through 08 — exceptions, casts, templates and STL containers.",
    highlights: [
      {
        title: "CPP05 — exceptions",
        body: "A Bureaucrat with a grade that must stay inside a fixed range, throwing custom exception classes when it does not. Grows into an abstract AForm with three concrete forms — shrubbery creation, robotomy request and presidential pardon — and an Intern that builds them by name.",
      },
      {
        title: "CPP06 — casts and type identity",
        body: "A ScalarConverter that parses a string and converts it between char, int, float and double. A Serializer that round trips a pointer through an integer type. And a Base class hierarchy where the real runtime type of a random object is identified both by pointer and by reference.",
      },
      {
        title: "CPP07 — templates",
        body: "Function templates for swap, min and max that work on any comparable type, an iter template that applies a function to every element of an array, and an Array class template with bounds checked access and its own deep copy.",
      },
      {
        title: "CPP08 — containers and iterators",
        body: "An easyfind template that searches any STL container, a Span class that stores numbers and reports the shortest and longest distance between any two of them, and a MutantStack that gives std::stack the iterators it normally hides.",
      },
    ],
  },
  {
    id: "Inception",
    repo: "Inception",
    title: "Inception",
    category: "42",
    icon: SiDocker,
    accent: accent.infra,
    description:
      "A small infrastructure built entirely from hand written Dockerfiles: NGINX with TLS, WordPress on PHP-FPM and MariaDB, wired together with docker-compose and persistent volumes.",
    tags: ["Docker", "NGINX", "MariaDB", "DevOps"],
  },
  {
    id: "MiniRT",
    repo: "MiniRT",
    title: "miniRT",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "A ray tracer in C. Parses a scene description, then renders spheres, planes and cylinders with Phong shading, shadows and a configurable camera.",
    tags: ["C", "Ray Tracing", "Graphics", "Linear Algebra"],
  },
  {
    id: "minishell",
    repo: "minishell",
    title: "minishell",
    category: "42",
    icon: SiGnubash,
    accent: accent.infra,
    description:
      "A working shell in C. Lexer and parser for quotes, redirections and pipes, plus its own builtins, environment handling and signal behaviour that matches bash.",
    tags: ["C", "Parsing", "Processes", "Signals"],
  },
  {
    id: "philo",
    repo: "philo",
    title: "Philosophers",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "The dining philosophers problem solved with threads and mutexes. No philosopher starves and no data race survives, which is the entire difficulty of the exercise.",
    tags: ["C", "Threads", "Mutex", "Concurrency"],
  },
  {
    id: "push_swap",
    repo: "push_swap",
    title: "push_swap",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "Sorting a stack with a restricted instruction set, using a radix sort to keep the instruction count low. Graded purely on how short the output sequence is.",
    tags: ["C", "Radix Sort", "Algorithms", "Optimisation"],
    overview:
      "Two stacks, eleven allowed operations, and a single goal: leave the numbers sorted using as few instructions as possible. The program prints the instruction sequence and a separate checker binary replays it to confirm the result.",
    highlights: [
      {
        title: "Radix sort for the general case",
        body: "Numbers are replaced by their sorted index, then sorted bit by bit in radix.c. Each pass pushes values whose current bit is zero and rotates the rest, which keeps the instruction count predictable as the input grows.",
      },
      {
        title: "Hard coded routines for small stacks",
        body: "Three, four and five element inputs never reach the radix path. mini_sort.c handles them with fixed move sequences, because at that size a general algorithm always loses on instruction count.",
      },
      {
        title: "Validation before anything else",
        body: "av_control.c rejects duplicates, non numeric arguments and values outside integer range before a single operation is emitted, so the sort itself never has to defend against bad input.",
      },
      {
        title: "Operations kept separate",
        body: "The eleven stack operations live in ps_action.c and ps_action_2.c, isolated from the sorting logic so the algorithm reads as a sequence of moves rather than pointer surgery.",
      },
    ],
  },
  {
    id: "fractol",
    repo: "fractol",
    title: "fract-ol",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "Real time fractal explorer built on MiniLibX, rendering the Mandelbrot and Julia sets with interactive zoom deep into the boundary.",
    tags: ["C", "MiniLibX", "Fractals", "Graphics"],
    overview:
      "A graphical program that renders escape time fractals pixel by pixel and redraws them as you move. The window, event loop and framebuffer all come from MiniLibX, which is vendored into the repository so the project builds without a system wide install.",
    highlights: [
      {
        title: "Two fractal sets",
        body: "mandelbrot.c and julia.c each implement their own iteration. The Julia set takes its constant from the command line, so a single binary renders an entire family of shapes rather than one fixed image.",
      },
      {
        title: "Escape time rendering",
        body: "build_set.c walks every pixel, maps it into the complex plane and iterates until the value escapes or the limit is reached. The iteration count at that point decides the colour, which is what makes the fractal boundary visible.",
      },
      {
        title: "Input guarded up front",
        body: "error_handle.c validates the fractal name and its parameters before a window is ever opened, so a typo produces a usage message instead of an empty frame.",
      },
      {
        title: "MiniLibX vendored in",
        body: "The minilibx-linux sources sit in the repository alongside the project, so cloning and running make is enough — there is no separate graphics library to install first.",
      },
    ],
  },
  {
    id: "minitalk",
    repo: "minitalk",
    title: "minitalk",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "A client and server that exchange whole strings using nothing but the two UNIX user signals, encoding each character one bit at a time.",
    tags: ["C", "IPC", "Signals", "Bitwise"],
    overview:
      "Two programs and a very small channel. The server prints its process id and waits; the client takes that id and a string, and transmits the string using only SIGUSR1 and SIGUSR2 — one signal per bit.",
    highlights: [
      {
        title: "One bit per signal",
        body: "Each character is shifted through eight times and a different signal is sent for a zero than for a one. The server rebuilds the byte in its handler and prints the character once all eight bits have arrived.",
      },
      {
        title: "Handlers kept minimal",
        body: "Signal handlers run asynchronously and may interrupt anything, so state is kept in the few constructs that are safe there and the work done inside a handler stays as small as possible.",
      },
      {
        title: "Bonus: acknowledgement",
        body: "client_bonus.c and server_bonus.c add a reply signal for every bit received, so the client waits for confirmation instead of transmitting blind and losing bits under load.",
      },
    ],
  },
  {
    id: "get_next_line",
    repo: "get_next_line",
    title: "get_next_line",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "Reads one line at a time from any file descriptor, keeping the leftover bytes in a static buffer between calls so nothing is read twice or lost.",
    tags: ["C", "File I/O", "Static Memory"],
    overview:
      "A single function that returns the next line from a file descriptor each time it is called, and NULL when there is nothing left. The difficulty is not reading — it is what happens between two calls.",
    highlights: [
      {
        title: "State that survives the return",
        body: "read() hands back a fixed size chunk that rarely stops at a newline. Whatever comes after the newline is kept in a static buffer so the following call continues exactly where the previous one stopped.",
      },
      {
        title: "Any buffer size",
        body: "BUFFER_SIZE is a compile time define and the implementation has to be correct for all of them — from one byte at a time to a buffer larger than the entire file.",
      },
      {
        title: "No leaks at the edges",
        body: "End of file, a file with no trailing newline, an empty file and a closed descriptor each need the stored buffer released rather than abandoned.",
      },
    ],
  },
  {
    id: "ft_printf",
    repo: "ft_printf",
    title: "ft_printf",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "A reimplementation of printf with variadic arguments, handling the conversion specifiers of the original and returning the same character count.",
    tags: ["C", "Variadic", "Formatting"],
    overview:
      "A formatted output function built on the variadic argument macros. It walks the format string, and for every conversion specifier it pulls the matching argument off the stack, converts it and counts the bytes written.",
    highlights: [
      {
        title: "Variadic argument handling",
        body: "va_start, va_arg and va_end drive the whole function. Since the argument types are only known from the format string, reading the wrong specifier reads the wrong type — the format string is the only contract there is.",
      },
      {
        title: "Pointer and hexadecimal output",
        body: "ft_ptrhex.c handles the %p, %x and %X conversions, converting to base sixteen by hand including the 0x prefix and the null pointer case.",
      },
      {
        title: "Return value that matches",
        body: "Every conversion adds its own byte count to a running total, because the function is expected to return exactly the number of characters printed, just as the original does.",
      },
    ],
  },
  {
    id: "libft",
    repo: "libft",
    title: "libft",
    category: "42",
    icon: SiC,
    accent: accent.c,
    description:
      "The first project of the cursus: a static library rebuilding the parts of the C standard library that every later project depends on.",
    tags: ["C", "libc", "Static Library"],
    overview:
      "Around thirty four functions compiled into libft.a, written before any of them could be used from the standard library. Almost every later project in the cursus links against this.",
    highlights: [
      {
        title: "Standard library rewrites",
        body: "Character tests such as isalpha and isdigit, the memory family — memset, bzero, memcpy, memmove, memchr, memcmp and calloc — and the string family including strlen, strlcpy, strlcat, strchr, strrchr, strncmp, strnstr and strdup.",
      },
      {
        title: "Functions libc does not have",
        body: "substr, strjoin, strtrim, split, itoa, strmapi and striteri. split is the awkward one: it allocates an array of allocations, so every failure path has to unwind what was already allocated.",
      },
      {
        title: "Output and conversion",
        body: "putchar_fd, putstr_fd, putendl_fd and putnbr_fd write to an arbitrary descriptor rather than assuming stdout, plus atoi, toupper and tolower.",
      },
      {
        title: "Built as a real library",
        body: "The Makefile archives the objects into libft.a with ar and keeps the usual all, clean, fclean and re targets, so the result is a library other projects link against rather than a folder of sources to copy.",
      },
    ],
  },
];

export default projects;

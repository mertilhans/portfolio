import { createChat } from "./engine";
import { editDistance, similarity, normalize } from "./text";

/*
  Her test gelistirme sirasinda gercekten bozulmus ya da yeni eklenmis
  bir davranisi sabitliyor. Cogunda yeni bir oturum aciliyor; sohbet
  hafizasi testleri ayni oturumda birden fazla soru soruyor.
*/

const ids = (reply) => (reply.cards || []).map((card) => card.projectId);
const fresh = (question) => createChat().ask(question);

describe("text layer", () => {
  test("Turkish characters are folded before lowercasing", () => {
    expect(normalize("İSTANBUL'da Işık")).toBe("istanbul da isik");
  });

  test("transposed letters count as one edit", () => {
    expect(editDistance("dokcer", "docker")).toBe(1);
  });

  test("Turkish suffixes and English plurals match their root", () => {
    expect(similarity("kitaplari", "kitap")).toBeGreaterThan(0);
    expect(similarity("processes", "process")).toBeGreaterThan(0);
    expect(similarity("minishel", "minishell")).toBeGreaterThan(0);
    expect(similarity("hava", "docker")).toBe(0);
  });
});

describe("structured questions", () => {
  test("C++ lists the C++ projects, not the C ones", () => {
    const reply = fresh("which projects use C++");
    expect(reply.text).toMatch(/C\+\+98/);
    expect(ids(reply)).toContain("Web_serv-std98-");
    expect(ids(reply)).not.toContain("libft");
  });

  test("single-letter C finds the C projects", () => {
    const reply = fresh("which projects use C");
    expect(reply.text).toMatch(/libft/);
    expect(reply.text).toMatch(/minishell/);
  });

  test("long lists are capped in cards but complete in text", () => {
    const reply = fresh("show me the 42 projects");
    expect(reply.cards.length).toBeLessThanOrEqual(6);
    expect(reply.more).toBeGreaterThan(0);
    expect(reply.text).toMatch(/libft/);
  });

  test("counting questions", () => {
    expect(fresh("how many projects are there").text).toMatch(/^\d+ projects: \d+ from the 42 cursus/);
    expect(fresh("kac tane kitap var").text).toMatch(/books on the shelf/);
  });
});

describe("free search over the whole site", () => {
  test("a project name resolves to that project", () => {
    expect(ids(fresh("tell me about minishell"))).toEqual(["minishell"]);
  });

  test("typos still find the project", () => {
    expect(ids(fresh("tell me about minishel"))).toEqual(["minishell"]);
    expect(ids(fresh("philosphers"))).toEqual(["philo"]);
  });

  test("a topic finds the section that discusses it", () => {
    const reply = fresh("how does the jacobsthal insertion order work");
    expect(ids(reply)).toEqual(["cpp09"]);
    expect(reply.text).toMatch(/Ford-Johnson/);
  });

  test("a topic shared by several projects returns all of them", () => {
    const reply = fresh("which projects deal with signals");
    expect(ids(reply)).toEqual(expect.arrayContaining(["minitalk", "minishell"]));
  });

  test("Turkish questions", () => {
    expect(fresh("hangi kitaplari okudun").text).toMatch(/^Finished:/);
    expect(fresh("hangi kampuste okuyorsun").text).toMatch(/42 Kocaeli/);
    expect(fresh("wuri siralamasi").text).toMatch(/2023: #6/);
  });

  test("quotes and books are searchable", () => {
    expect(fresh("what did knuth say").text).toMatch(/Premature optimization/);
    expect(fresh("linux programming interface").text).toMatch(/Kerrisk/);
  });

  test("certifications, contact and 42", () => {
    expect(fresh("what certifications do you have").text).toMatch(/Google/);
    expect(fresh("how can I contact you").text).toMatch(/mertilhanbv@gmail\.com/);
    const school = fresh("What is 42?");
    expect(school.text).toMatch(/42 Kocaeli/);
    expect(school.link.to).toBe("/project");
  });
});

describe("conversation memory", () => {
  test("tell me more walks through the sections in order", () => {
    const chat = createChat();
    chat.ask("tell me about push_swap");
    const first = chat.ask("tell me more");
    const second = chat.ask("more");
    expect(first.text).toMatch(/^Radix sort/);
    expect(second.text).toMatch(/^Hard coded routines/);
    expect(first.cards[0].note).toBe("1 of 4");
  });

  test("tell me more stops when everything has been shown", () => {
    const chat = createChat();
    chat.ask("tell me about get_next_line");
    chat.ask("more");
    chat.ask("more");
    chat.ask("more");
    expect(chat.ask("more").text).toMatch(/That's everything/);
  });

  test("a README-only project points to its page", () => {
    const chat = createChat();
    chat.ask("tell me about minishell");
    expect(chat.ask("tell me more").text).toMatch(/README/);
  });

  test("'it' refers to the last project", () => {
    const chat = createChat();
    chat.ask("tell me about push_swap");
    const reply = chat.ask("how does it validate input");
    expect(ids(reply)).toEqual(["push_swap"]);
    expect(reply.text).toMatch(/Validation before anything else/);
  });

  test("'which of those' filters the previous list", () => {
    const chat = createChat();
    chat.ask("which projects deal with signals");
    const reply = chat.ask("which of those has a bonus");
    expect(ids(reply)).toEqual(["minitalk"]);
  });

  test("related books for the last project", () => {
    const chat = createChat();
    chat.ask("tell me about minishell");
    const reply = chat.ask("which books relate to it");
    expect(reply.text).toMatch(/The Linux Programming Interface/);
  });

  test("'Tell me more' stays offered while sections remain", () => {
    // Tarayicida bulundu: "Tell me more" sorulunca oneri listesinden
    // dusuyordu, oysa okunmamis bolum vardi.
    const chat = createChat();
    chat.ask("tell me about push_swap");
    expect(chat.ask("tell me more").followUps).toContain("Tell me more");
  });

  test("follow-up suggestions fit the answer", () => {
    const reply = fresh("tell me about push_swap");
    expect(reply.followUps).toContain("Tell me more");
    expect(reply.followUps.some((f) => f.startsWith("What else uses"))).toBe(true);
  });
});

describe("questions found while reading real answers", () => {
  test("identity questions made only of stop words", () => {
    expect(fresh("who are you").text).toMatch(/^Mert Ilhan/);
    expect(fresh("what are you studying").text).toMatch(/42 Kocaeli/);
  });

  test("'projects' is not treated as search content", () => {
    // Bir ara "dokcer projects" libft ve portfolyoyu da donduruyordu.
    const reply = fresh("dokcer projects");
    expect(ids(reply).sort()).toEqual(["Inception", "transcendence"]);
  });

  test("a one-project list still offers follow-ups", () => {
    expect(fresh("ai projects").followUps.length).toBeGreaterThan(0);
  });

  test("the question just asked is not suggested again", () => {
    const chat = createChat();
    chat.ask("tell me about minishell");
    const reply = chat.ask("Which books relate to it?");
    expect(reply.followUps).not.toContain("Which books relate to it?");
  });

  test("no invented favourite book", () => {
    expect(fresh("what is your favorite book").text).toMatch(/no favourite on record/);
  });
});

describe("small talk and refusals", () => {
  test("greetings, including the Turkish short form", () => {
    expect(fresh("merhaba").text).toMatch(/^Hey!/);
    expect(fresh("reis sa").text).toMatch(/^Hey!/);
  });

  test("off-topic questions are refused rather than guessed", () => {
    expect(fresh("istanbulda hava nasil").unknown).toBe(true);
    expect(fresh("what is the capital of france").unknown).toBe(true);
    expect(fresh("recipe for pancakes").unknown).toBe(true);
  });

  test("empty input gets a prompt, not a crash", () => {
    expect(fresh("   ").text).toMatch(/Ask me about/);
  });
});

import {
  SiC,
  SiCplusplus,
  SiDocker,
  SiGnubash,
  SiMariadb,
  SiNginx,
  SiPython,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiPhp,
} from "react-icons/si";

/*
  Teknoloji adi -> logo eslemesi. Hem etiketlerde hem de GitHub'dan gelen
  "language" degerinde kullanilir, bu yuzden anahtarlar kucuk harfe
  cevrilerek aranir ve ayni logoya birden fazla ad baglanabilir
  (C++ / C++98, Docker / Dockerfile gibi).

  Logosu olmayan etiketler (Ray Tracing, Concurrency, HTTP...) sade
  kalir; bunun icin eslesmeyen adlarda null donuyoruz.
*/
const icons = {
  c: SiC,
  "c++": SiCplusplus,
  "c++98": SiCplusplus,
  cpp: SiCplusplus,
  docker: SiDocker,
  dockerfile: SiDocker,
  nginx: SiNginx,
  mariadb: SiMariadb,
  shell: SiGnubash,
  bash: SiGnubash,
  python: SiPython,
  react: SiReact,
  javascript: SiJavascript,
  html: SiHtml5,
  php: SiPhp,
};

export default function techIcon(name) {
  if (!name) return null;
  return icons[String(name).trim().toLowerCase()] || null;
}

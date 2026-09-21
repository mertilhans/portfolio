import React from "react";
import { Link } from "react-router-dom";
import { BsPlayFill } from "react-icons/bs";
import projects from "./projectData";
import fractolImage from "../../Assets/playground/fractol-julia.jpg";
import minirtImage from "../../Assets/playground/minirt-epic.jpg";

/*
  Projeler sayfasinin basindaki vitrin: tarayicida calisan projeler.
  Kapak gorselleri C programlarinin kendi ciktilari (sahte MiniLibX ile
  derlenip goruntu tamponu dosyaya yazildi), yani demoda gorulenle ayni.
*/
const showcase = {
  fractol: {
    image: fractolImage,
    alt: "Julia set -0.8, 0.156 rendered by fract-ol",
    pitch: "Zoom into the Mandelbrot and Julia sets. Click, scroll or pinch.",
  },
  minirt: {
    image: minirtImage,
    alt: "The yilbasi_epic.rt scene rendered by miniRT",
    pitch: "Fly around the ray traced scenes from the repo. Click an object, drag to orbit.",
  },
};

function LiveDemos() {
  const demos = projects.filter((p) => p.playground && showcase[p.playground]);
  if (demos.length === 0) return null;

  return (
    <section className="live-demos" aria-labelledby="live-demos-title">
      <div className="live-demos-head">
        <span className="live-demos-dot" aria-hidden="true" />
        <h2 id="live-demos-title">Run them in your browser</h2>
      </div>
      <p className="live-demos-sub">
        Two of my C projects, ported line by line to JavaScript. Same maths,
        same output, pixel for pixel, no install.
      </p>

      <div className="live-demos-grid">
        {demos.map((project) => {
          const item = showcase[project.playground];
          return (
            <Link
              key={project.id}
              to={{ pathname: `/project/${project.id}`, hash: "#try" }}
              className="live-demo-card"
            >
              <div className="live-demo-media">
                <img src={item.image} alt={item.alt} loading="lazy" />
                <span className="live-demo-play">
                  <BsPlayFill aria-hidden="true" /> Run live
                </span>
              </div>
              <div className="live-demo-body">
                <h3>
                  {project.title}
                  <span className="live-demo-lang">C → JS</span>
                </h3>
                <p>{item.pitch}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default LiveDemos;

import React from "react";
import Particles from "react-tsparticles";

function Particle() {
  return (
    <Particles
      id="tsparticles"
      params={{
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              value_area: 1500,
            },
          },
          line_linked: {
            enable: false,
            opacity: 0.03,
          },
          move: {
            direction: "right",
            speed: 0.05,
          },
          size: {
            value: 1,
          },
          opacity: {
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.05,
            },
          },
        },
        // Katman pointer-events:none oldugu icin tiklama olayi hic
        // ulasmiyor; "tikla, parcacik ekle" ayari bu yuzden kaldirildi.
        retina_detect: true,
      }}
    />
  );
}

export default Particle;

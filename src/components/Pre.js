import React from "react";

/*
  Acilis ekrani: kucuk bir kara delik. Siyah bir cekirdek ve ince foton
  halkasi, etrafinda egik bir disk yorungesi; cevredeki minik parcaciklar
  sarmal cizerek icine cekiliyor. Altinda ince bir yukleme cizgisi.
  Site hazir olunca (load=false) cekirdek icine cokup ekran soluyor.
  Hepsi CSS.
*/
const PARTICLES = [0, 1, 2, 3, 4, 5, 6, 7];

function Pre({ load }) {
  return (
    <div className={`preloader${load ? "" : " is-done"}`} aria-hidden={!load}>
      <div className="bh" role="img" aria-label="Loading">
        {PARTICLES.map((i) => (
          <span key={i} className="bh-particle" style={{ "--i": i }} />
        ))}
        <span className="bh-orbit" />
        <span className="bh-core" />
      </div>
      <div className="preloader-bar" />
    </div>
  );
}

export default Pre;

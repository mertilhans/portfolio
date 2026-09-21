import { lazy } from "react";

/*
  projectData'daki "playground" alani -> bilesen. Motorlar ayri parcalar
  halinde yukleniyor: yalnizca bu iki proje sayfasini acan indiriyor.
*/
const playgrounds = {
  fractol: lazy(() => import("./FractolPlayground")),
  minirt: lazy(() => import("./MinirtPlayground")),
};

export default playgrounds;

const puppeteer = require('puppeteer');

(async () => {
  console.log("Empezando scraper...");

  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 500,
  });
  const page = await browser.newPage();

  await page.goto('https://nextviaje.now.sh/');

  const urls = await page.evaluate(() => 
    Array.from(
      document.querySelectorAll('.FilaCasas__cartas a'),
      nodo => nodo.href
    )
  );

  await page.goto(urls[0]);
  const detallesDeLaCasa = await page.evaluate(() => {
    const imagenes = [
      ...document.querySelectorAll('.CasaVista__fotos img'),
    ].map(img => img.src);

    const titulo = document.querySelector('.CasaVista__titulo').innerText;
    const ubicacion = document.querySelector('.CasaVista__titulo + div').innerText;

    const precio = Number(document.querySelector('.CasaVista__precio')
      .innerText.replace(/[^0-9]/g, ""));

    const comodidades = [
      ...document.querySelectorAll('.CasaVista__cuartos span')
    ].reduce((acc, comodidad) => {
      const [cantidad, nombre] = comodidad.innerText.split(' ');

      acc[nombre] = Number(cantidad);

      return acc;
    }, {})

    const servicios = [
      ...document.querySelectorAll('.CasaVista__extra')
    ].map((nodo) => nodo.innerText.toLowerCase());
    const numeroDeEstrellas = Number(document.querySelector('.Opiniones__numero-de-estrellas').innerText);
    const numeroDeopiniones = Number(document.querySelector('.Opiniones__numero-de-opiniones').innerText.replace(/[^0-9]/g, ""));

    const comentarios = [
      ...document.querySelectorAll('.Opinion')
    ].reduce((op, comentario) => {
      const fecha = comentario.firstChild.lastChild.lastChild.innerText;
      op['Fecha'] = fecha;

      const nombre = comentario.firstChild.lastChild.firstChild.innerText;
      op['Nombre'] = nombre;

      const opinion = comentario.lastChild.innerText;
      op['Comentario'] = opinion;

      // const [nombre, descripcion] = comentario.firstChild.lastChild.lastChild.innerText;
      // op[nombre] = descripcion;

      // const [fecha, date] = comentario.firstChild.lastChild.firstChild.innerText;
      // op[fecha] = date;

      // const [fecha, date] = comentario.firstChild.lastChild.firstChild.innerText;
      // op[fecha] = date;

      return op;

    }, {})
      

    return {
      imagenes,
      titulo,
      ubicacion,
      precio,
      comodidades,
      servicios,
      numeroDeEstrellas,
      numeroDeopiniones,
      url: window.location.href,
      comentarios
    }
  })

  console.log(detallesDeLaCasa);
})()
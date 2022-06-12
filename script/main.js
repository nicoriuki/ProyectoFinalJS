/* difino los Meses */
const MESES = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
      ],
      MESES31 = [0, 2, 4, 6, 7, 9, 11],
      MESES30 = [3, 5, 8, 10];
/*Defino los array vacios que voy a usar */
let eventos = [],
      dias = [],
      feriados2 = [];
/*FECTH*/
const feriaditos = async () => {
      let promesa = await fetch("script/feriados.json");
      let feriado = await promesa.json();

      return feriado.feriados;
};

/* Defino la fecha */
let fechaActual = new Date(),
      diaActual = fechaActual.getDate(),
      mesNumero = fechaActual.getMonth(),
      anioActual = fechaActual.getFullYear();
/* capturo los elementos del dom */
const d = document,
      ls = localStorage,
      modalAgregar = new bootstrap.Modal(d.getElementById("modalAgregar"), {
            keyboard: false,
      }),
      modalTodosDias = new bootstrap.Modal(d.getElementById("modalDia"), {
            keyboard: false,
      }),
      body = d.getElementById("body"),
      mesHtml = d.getElementById("mes"),
      anioHtml = d.getElementById("anio"),
      diasHtml = d.getElementById("diasSemanales"),
      anioSiguiente = d.getElementById("anioSiguiente"),
      anioAnterrion = d.getElementById("anioAnterior"),
      mesSiguiente = d.getElementById("mesSiguiente"),
      mesPrevio = d.getElementById("mesPrevio"),
      semanaPrevio = d.getElementById("semanaPrevio"),
      semanaSiguiente = d.getElementById("semanaSiguiente"),
      diasTabla = d.querySelectorAll("td"),
      diaModal = d.getElementById("diaModal"),
      mesActualModal = d.getElementById("mesActualModal"),
      mesModal = d.getElementById("mesModal"),
      anioModal = d.getElementById("anioModal"),
      eventosModal = d.getElementById("eventosModal"),
      modalDia = d.getElementById("modalDia"),
      diaTitulo = d.getElementById("diaTitulo"),
      diaBody = d.getElementById("diaBody"),
      diaN = "diaN",
      diaE = "diaE";
mesHtml.innerHTML = `${MESES[mesNumero]} de ${anioActual}`;
diaModal.value = diaActual;
mesActualModal.value = mesNumero;
mesActualModal.innerText = MESES[mesNumero];
anioModal.value = anioActual;

/*LOCAL STORAGE*/
ls.getItem("evento")
      ? (eventos = JSON.parse(ls.getItem("evento")))
      : ls.setItem("evento", JSON.stringify(eventos));

let eventos2 = eventos.sort((a, b) => a.hora - b.hora);
/*Defino los Divs de los eventos*/
function diasLetras(diaLetra, diaString) {
      for (let i = 0; i <= 41; i++) {
            eval("const " + diaLetra + i + "= " + i + ";");
            diaLetra[i] = d.getElementById("diaString" + [i]);
      }
}
diasLetras(diaN, "diaN");
diasLetras(diaE, "diaE");

/*creo la clases */
class Dia {
      constructor(dia, mes, anio, color) {
            this.dia = dia;
            this.mes = mes;
            this.anio = anio;
            this.color = color;
      }
}
class Evento {
      constructor(
            id,
            conjunto,
            dia,
            mes,
            anio,
            color,
            hora,
            titulo,
            descripcion
      ) {
            this.id = id;
            this.conjunto = conjunto;
            this.dia = dia;
            this.mes = mes;
            this.anio = anio;
            this.color = color;
            this.hora = hora;
            this.titulo = titulo;
            this.descripcion = descripcion;
      }
}

/* Funcion para mostrar el calendario */
function cargarDias() {
      if (mesNumero === 0) {
            for (let i = primerDia(); i > 0; i--) {
                  dias.push(
                        new Dia(
                              diasDelMes(mesNumero - 1) - (i - 1),
                              11,
                              anioActual - 1,
                              "mesNoActual"
                        )
                  );
            }
      } else {
            for (let i = primerDia(); i > 0; i--) {
                  dias.push(
                        new Dia(
                              diasDelMes(mesNumero - 1) - (i - 1),
                              mesNumero - 1,
                              anioActual,
                              "mesNoActual"
                        )
                  );
            }
      }
      /*dias del mes*/
      for (let i = 1; i <= diasDelMes(mesNumero); i++) {
            dias.push(new Dia(i, mesNumero, anioActual, "mesActual"));
      }
      /*ultimos dias */
      if (mesNumero === 11) {
            for (let i = 1; dias.length <= 41; i++) {
                  dias.push(new Dia(i, 0, anioActual + 1, "mesNoActual"));
            }
      } else {
            for (let i = 1; dias.length <= 41; i++) {
                  dias.push(
                        new Dia(i, mesNumero + 1, anioActual, "mesNoActual")
                  );
            }
      }
}
function pintarFeriados() {
      for (let i = 0; i <= dias.length - 1; i++) {
            feriaditos().then((feriado) => {
                  feriado.forEach((feriado) => {
                        if (
                              dias[i].dia === parseInt(feriado.dia) &&
                              dias[i].mes === parseInt(feriado.mes) &&
                              dias[i].anio === parseInt(feriado.anio)
                        ) {
                              d.getElementById("diaN" + i).innerHTML += `
                       <div class="evento evento${i}  noHabil" > ${feriado.titulo}</div> 
                        `;
                              feriados2.push(feriado);
                              diasTabla[i].classList.add("noHabil");
                        }
                  });
            });
      }
}
function pintarEventos() {
      for (let i = 0; i <= dias.length - 1; i++) {
            eventos2.forEach((evento) => {
                  if (
                        dias[i].dia === parseInt(evento.dia) &&
                        dias[i].mes === parseInt(evento.mes) &&
                        dias[i].anio === parseInt(evento.anio)
                  ) {
                        if (evento.hora.toString().length == 3) {
                              evento.hora = "0" + evento.hora;
                        }
                        if (evento.hora.toString().length == 2) {
                              evento.hora = "00" + evento.hora;
                        }
                        if (evento.hora.toString().length == 1) {
                              evento.hora = "000" + evento.hora;
                        }
                        d.getElementById("diaE" + i).innerHTML += `
                       <div class="evento evento${i} bg-${
                              evento.color
                        } rounded-pill" >${
                              evento.hora.toString().slice(0, 2) +
                              ":" +
                              evento.hora.toString().slice(2, 4)
                        } - ${evento.titulo}</div> 
                        `;
                  }
            });
            if (d.querySelectorAll(".evento" + i).length >= 4) {
                  let event = d.querySelectorAll(".evento" + i).length;
                  d.getElementById("diaE" + i).innerHTML = `
                        <div class="evento evento${i} econjunto bg-success rounded-pill" >${event} eventos</div>`;
            }
      }
}
function pintarDias() {
      for (let i = 0; i <= dias.length - 1; i++) {
            d.getElementById("dia" + i).value =
                  dias[i].dia + "" + dias[i].mes + "" + dias[i].anio;
            d.getElementById("diaN" + i).innerHTML = " ";
            d.getElementById("diaE" + i).innerHTML = " ";
            d.getElementById(
                  "diaN" + i
            ).innerHTML += `<p class="numeroDia">${dias[i].dia}</p>`;
            diasTabla[i].classList.add(dias[i].color);
      }
}
function fondo(mes) {
      if ([11, 0, 1].includes(mes)) {
            body.classList.remove("otonio", "invierno", "primavera");
            body.classList.add("verano");
      } else if ([2, 3, 4].includes(mes)) {
            body.classList.remove("verano", "invierno", "primavera");
            body.classList.add("otonio");
      } else if ([5, 6, 7].includes(mes)) {
            body.classList.remove("verano,otonio", "invierno", "primavera");
            body.classList.add("invierno");
      } else if ([8, 9, 10].includes(mes)) {
            body.classList.remove("verano", "otonio", "invierno");
            body.classList.add("primavera");
      }
}
function mostrarCalendario() {
      diasTabla.forEach((dia) => {
            dia.classList.remove("noHabil", "mesNoActual", "mesActual");
      });
      fondo(mesNumero);
      cargarDias();
      pintarDias();
      pintarFeriados();
      pintarEventos();
}
/*calcular  los dias de los meses*/

function diasDelMes(mes) {
      if (mes === -1) mes = 11;
      if (MESES31.includes(mes)) {
            return 31;
      } else if (MESES30.includes(mes)) {
            return 30;
      } else {
            return anioBiciesto() ? 29 : 28;
      }
}
/*calcular el año biciesto*/
function anioBiciesto() {
      return (
            (anioActual % 100 !== 0 && anioActual % 4 === 0) ||
            anioActual % 400 === 0
      );
}
/*mostrar los primeros dias*/
function primerDia() {
      let diaInicio = new Date(anioActual, mesNumero, 1);
      let resultado = diaInicio.getDay();
      /* Pongo que la semana empieze en lunes */
      resultado--;
      if (resultado == -1) {
            resultado = 6;
      }
      return resultado;
}
/*mostrar los ultimos dias*/
function ultimoDia() {
      let diaInicio = new Date(anioActual, mesNumero, 1);
      let resultado = diaInicio.getDay();
      return resultado;
}
/*funcion  para iterar los meses*/
function siguienteMes() {
      dias = [];
      feriados2 = [];

      if (mesNumero !== 11) {
            mesNumero++;
      } else {
            mesNumero = 0;
            anioActual++;
      }
      cargarNuevaFecha();
}

function anteriorMes() {
      dias = [];
      feriados2 = [];
      if (mesNumero !== 0) {
            mesNumero--;
      } else {
            mesNumero = 11;
            anioActual--;
      }
      cargarNuevaFecha();
}
/*funcion  para iterar los Años*/
function siguienteAnio() {
      dias = [];
      feriados2 = [];
      anioActual++;

      cargarNuevaFecha();
}

function anteriorAnio() {
      dias = [];
      feriados2 = [];
      anioActual--;

      cargarNuevaFecha();
}

/*funcion para cargar las nuevas fechas */
const fecha = [anioActual, mesNumero, diaActual];
function cargarNuevaFecha() {
      fechaActual.setFullYear(...fecha);
      mesHtml.innerHTML = `${MESES[mesNumero]} de ${anioActual}`;
      mostrarCalendario();
}

/*captura de eventos */
mesSiguiente.addEventListener("click", () => {
      siguienteMes();
});
mesPrevio.addEventListener("click", () => {
      anteriorMes();
});

function idEvento(hora, dia, mes) {
      return hora + "" + dia + "" + mes;
}
/*eventos para agregar eventos*/
MESES.forEach((mes, index) => {
      let option = d.createElement("option");
      option.value = index;
      option.innerHTML = mes;
      mesModal.append(option);
});
eventosModal.addEventListener("submit", (e) => {
      e.preventDefault();
      eventos.push(
            new Evento(
                  idEvento(
                        parseInt(
                              eventosModal.horaModal.value.slice(0, 2) +
                                    eventosModal.horaModal.value.slice(3, 5)
                        ),
                        eventosModal.diaModal.value,
                        eventosModal.mesModal.value
                  ),
                  eventosModal.diaModal.value +
                        "" +
                        eventosModal.mesModal.value +
                        "" +
                        eventosModal.anioModal.value,
                  eventosModal.diaModal.value,
                  eventosModal.mesModal.value,
                  eventosModal.anioModal.value,
                  eventosModal.colorModal.value,
                  parseInt(
                        eventosModal.horaModal.value.slice(0, 2) +
                              eventosModal.horaModal.value.slice(3, 5)
                  ),
                  eventosModal.tituloModal.value,
                  eventosModal.descripcionModal.value
            )
      );
      modalAgregar.hide();
      ls.setItem("evento", JSON.stringify(eventos));
      Toastify({
            text: `Evento ${eventosModal.tituloModal.value} agendado`,
            duration: 2000,
            newWindow: false,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: false,
            style: {
                  background:
                        "radial-gradient(circle at 4.07% 76.52%, #ffa51c 0, #ff9233 10%, #ff7e42 20%, #ff684d 30%, #ff5054 40%, #ff3858 50%, #e41f59 60%, #cc015b 70%, #b6005d 80%, #a2005f 90%, #910063 100%)",
            },
      }).showToast();
      setTimeout(() => {
            window.location.reload();
      }, 2500);
});

function eventosModal1(eventos, feriados, conjunto) {
      feriados.forEach((feriado) => {
            if (feriado.conjunto === conjunto) {
                  diaBody.innerHTML += `
                <div class="col-12 bg-danger mb-2 border-2 border rounded-3">
                <h4>${feriado.titulo}</h4>
                <p><a href="${feriado.descripcion}" target="_blank"rel="noopener">Descripcion en Wikipedia</a></p>
                </div>
                `;
            }
      });
      eventos.forEach((evento) => {
            /*Desestructuración*/
            let = { color, titulo, id, descripcion, hora } = evento;
            diaBody.innerHTML += `
                <div class=" col-12 bg-${color} mb-2 border-2 border rounded-3">
                <h4>${
                      hora.toString().slice(0, 2) +
                      ":" +
                      hora.toString().slice(2, 4)
                } - ${titulo}<img class="papelera" id="${id}" src="imagenes/papelera.png" ></h4>
                <p>${descripcion}</p>
                </div>
                `;
      });
}

function verSiHayEventos(dia) {
      let eventosdia = [];
      for (i = 0; i < eventos.length; i++) {
            if (eventos[i].conjunto == dia) {
                  diaBody.innerHTML = "";
                  eventosdia.push(eventos[i]);
            }
      }
      diaBody.innerHTML = "";
      modalTodosDias.show();
      eventosModal1(eventosdia, feriados2, dia);
}
d.addEventListener("click", (e) => {
      if (e.target.classList.contains("papelera")) {
            Swal.fire({
                  title: "Está seguro de eliminar el evento?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Sí, seguro",
                  cancelButtonText: "No, no quiero",
            }).then((result) => {
                  if (result.isConfirmed) {
                        let id = e.target.id;
                        eventos = eventos.filter((evento) => {
                              return evento.id != id;
                        });
                        ls.setItem("evento", JSON.stringify(eventos));
                        Swal.fire({
                              title: "Borrado!",
                              icon: "success",
                              text: "El evento ha sido borrado",
                              showConfirmButton: false,
                        });

                        setTimeout(() => {
                              window.location.reload();
                        }, 2500);
                  }
            });
      }
});
d.addEventListener("click", (e) => {
      if (e.target.closest(".dia")) {
            openModal(e.target.closest(".dia"));
      }
});
function openModal(dia) {
      let diaNumero = dia.id.slice(3, 5);
      diaTitulo.innerText = `Dia ${dias[diaNumero].dia} de ${
            MESES[dias[diaNumero].mes]
      } del ${dias[diaNumero].anio}`;
      diaModal.value = dias[diaNumero].dia;
      mesActualModal.innerHTML = MESES[dias[diaNumero].mes];
      mesActualModal.value = dias[diaNumero].mes;
      anioModal.value = dias[diaNumero].anio;

      verSiHayEventos(dia.value);
}
d.getElementById("btnAgregar").addEventListener("click", () => {
      diaModal.value = diaActual;
      mesActualModal.innerText = MESES[mesNumero];
      anioModal.value = anioActual;
      modalAgregar.show();
});
/*muestro el calendario*/
mostrarCalendario();

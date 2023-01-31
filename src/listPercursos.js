import { viewImage } from "./index.js"


const addPercursoToList = async (doc) => {    
    let percurso = await doc.data()
    let html = "";

   html += "<img class ='col-sm-5 img-fluid rounded' alt='Responsive image' id = 'percurso-imagem_" + percurso.id + "' src=''>"

    html += "<p>"

    html += "<p class='float:right'>" + percurso.Nome + "</p>"

    html += "<p> Data de Início : " + percurso.DataInicio + "</p>"
    html += "<p> Hora de Início : " + percurso.HoraInicio + "</p>"
    html += "<p> Nome do Instrutor : " + percurso.NomeCriador + "</p>"

    await viewImage(percurso.photoPercurso, "percurso-imagem_" + percurso.id)

    html += "<hr>"

    return html;
}
const listPercursos2 = async (data) => {

    const list = document.getElementById("list");

    const html = await addPercursoToList(data);
    
    list.innerHTML +=  html;
}  

export { listPercursos2 }
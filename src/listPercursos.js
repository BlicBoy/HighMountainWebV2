//import { viewImage } from "./index.js"


const addPercursoToList = async (doc) => {
    
    let percurso = await doc.data()
    let html = "";


    console.log(percurso.photoPercurso)
    //await viewImage(percurso.photoPercurso, "percurso-imagem")
    //html += "<img class ='col-md-4 img-fluid' id = 'percurso-imagem' src=''>";
    html += "<hr>";
    html += "<span class=''>" + percurso.Nome + "</span>";
    html += "<button class='btn btn-primary float-right'> Saber Mais </button>"
    //html += "<p> Data de Início = '" + percurso.DataInicio + "</p>";
    //html += "<p> Hora de Início = '" + percurso.HoraInicio + "</p>";
    //html += "<p> Nome do Instrutor = '" + percurso.NomeCriador + "</p>";

    return html;
}


const listPercursos2 = async (data) => {

    const list = document.getElementById("list");

    const html = await addPercursoToList(data);
    
    list.innerHTML +=  html;
}  


export { listPercursos2 }
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




const addPercursoToListCliente = async (doc) => {    
    let percurso = await doc.data()
    let html = "";

   html += "<img class ='col-sm-5 img-fluid rounded' alt='Responsive image' id = 'percurso-imagem_" + percurso.id + "' src=''>"

    html += "<p>"

    html += "<p class='float:right'>" + percurso.Nome + "</p>"

    html += "<p> Data de Início : " + percurso.DataInicio + "</p>"
    html += "<p> Hora de Início : " + percurso.HoraInicio + "</p>"
    html += "<p> Nome do Instrutor : " + percurso.NomeCriador + "</p>"
    html += "<button class='btn-7' id='participar' role='button'  data-id="+ percurso.id +" data-name = "+percurso.Nome+">Participar na Atividade</button>"

    await viewImage(percurso.photoPercurso, "percurso-imagem_" + percurso.id)


    html += "<hr>"

    return html;
}

const listPercursosClientes = async (data) => {

    const list = document.getElementById("list-percursos-clientes");

    const html = await addPercursoToListCliente(data);
    
    list.innerHTML +=  html;
}  



const addPercursoParticipate = async(doc) =>{
    let participante = await doc.data()
    let html = "";

    html += "<tr>"
        html += "<td scope='row'>"+ participante.uIdPercurso+"</td>"
        html += "<td>"+ participante.nomePercurso+"</td>"
        html += "<td>"+ participante.nomeParticipante+"</td>"
        html += "<td>"+ participante.email+"</td>"

    html += "</tr>"


    return html
}


const listPercursosParticipate = async (data) => {

    const list = document.getElementById("body-table");

    const html = await addPercursoParticipate(data);
    
    list.innerHTML +=  html;
}  



export { listPercursos2, listPercursosClientes, listPercursosParticipate }
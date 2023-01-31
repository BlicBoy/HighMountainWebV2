//import { viewImage } from "./index.js"

const addClientesToList = async (doc) => {
    
    let cliente = await doc.data()
    let html = "";

   
    html += "<img class ='col-sm-5 img-fluid rounded' alt='Responsive image' id = 'percurso-imagem_" + photoURL.id + "' src=''>"

    html += "<p>"

    html += "<p class='float:right'>" + cliente.FirstName + "</p>"

    html += "<p> Data de Início = '" + cliente.LastName + "</p>"
    html += "<p> Hora de Início = '" + cliente.DataNascimento + "</p>"
    html += "<p> Nome do Instrutor = '" +  + "</p>"

    await viewImage(percurso.photoPercurso, "percurso-imagem_" + percurso.id)

    html += "<hr>"

    return html;
}




const listClientes2 = async (data) => {

    const list = document.getElementById("listClient");

    const html = await addClientesToList(data);
    
    list.innerHTML +=  html;
}  


//export { listClientes2 }
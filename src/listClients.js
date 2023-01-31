import { viewImage } from "./index.js"

const addClientesToList = async (doc) => {
    
    let cliente = await doc.data()
    let html = "";

    if(cliente.role == "Cliente"){
        html += "<p>"
        viewImage(cliente.photoURL, "cliente_photo")
        html += "<img class ='col-sm-5 img-fluid rounded' alt='Responsive image' id = 'cliente_photo' width = '200px' height = '300px'>"

        html += "<p class='float:right'>" + cliente.FirstName + " " +cliente.LastName + "</p>"
        html += "<p> Data Nascimento : " + cliente.dataNascimento + "</p>"
        html += "<p> Numero Telemovel : " + cliente.numeroTelemovel + "</p>"
        html += "<p> Doenças : " + cliente.doencas + "</p>"
        html += "<p> Alergias : " + cliente.alergias + "</p>"
        html += "<p> Tipo de Sangue : " + cliente.tipodeSangue + "</p>"
    
        html += "<hr>"
    }
    


    console.log(html)

    return html;
}




const listClientes2 = async (data) => {

    const list = document.getElementById("listClient");

    const html = await addClientesToList(data);
    
    list.innerHTML +=  html;
}  


export { listClientes2 }
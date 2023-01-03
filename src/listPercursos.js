


const addPercursosToList = async(doc) =>{
    let percursos = doc.data();
    let html = "";


    html += "<tr>"
    html += "<td>" +doc.Nome+ "</td>"
    html += "<td>" +doc.Descricao+ "</td>"
    html += "<td>" + doc.DataInicio + "</td>"
    html += "<td>" + doc.HoraInicio + "</td>"
    html += "<td> + </td>"
    html += "<td> x </td>"
    

    html += "</tr>"
    


    return html
}



const listPercursos = async (data) =>{
    const list = document.querySelector("#list")

    const html = await addPercursosToList(data)

    list.innerHTML += html
} 


export {addPercursosToList, listPercursos}
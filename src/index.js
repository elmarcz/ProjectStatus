import fetch from "node-fetch";
import jspeed from "jspeed";
import { projects } from "./projects.js";

async function getState(url) {
    const response = await fetch(url);
    return response.status;
}

function interpretateState(status, name, url) {
    const json = { status: status, name: name, url: url };
    if (status == 200) {
        json.info = 'El servidor está funcionando correctamente'
        return json;
    } else if (status == 404) {
        json.info = 'El servidor no pudo encontrar el contenido solicitado.'
        return json;
    } else if (status == 500) {
        json.info = 'El servidor ha encontrado una situación que no sabe cómo manejarla.'
        return json;
    } else if (status == 511) {
        json.info = 'El cliente requiere de autentificación para obtener acceso a la red.'
        return json;
    } else {
        json.info = `No se pudo interpretar el codigo HTTP [${status}]`
        return json;
    }
}

async function prepareResult(url) {
    const name = projects.find(p => p.url == url)
    const status = await getState(url);
    const response = await interpretateState(status, name.name, url);
    let color;

    if (response.status === 200) color = 'green'
    else if (response.status === 404) color = 'red'
    else if (response.status === 500 || response.status === 511) color = 'yellow'
    else if (response.status == undefined) color = 'red'

    const statusMsg = jspeed.color(response.status, color)
    const projectName = jspeed.color(response.name, 'blue')

    jspeed.print(`[${statusMsg}] [${projectName}] ${response.info}`);
}

function main() {
    console.log('--------------- Project Status ---------------')
    projects.forEach(project => prepareResult(project.url))
}

console.clear()
main();
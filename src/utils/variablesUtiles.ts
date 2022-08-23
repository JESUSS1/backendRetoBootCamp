import path from "path";

//path.join(__dirname, '..', 'test', 'karma.conf.js')  Ejemplo : (ruta,retroceso,carpeta,archivo)
export const dirRaiz = path.join(__dirname, '../..');
export const entornoVirtualPyton = "C:\\Windows\\SysWOW64\\v_youtube_upload\\Scripts\\";

export const videoSource = {
    srcVideo: `${dirRaiz}\\srcvideos\\`,
    srcVideoOutput: `${dirRaiz}\\srcConvert\\`,
}
export const tipoProcesos = {
    'urls': 'urls',
    'download': 'download',
    'getNameVideos': 'getNameVideos',
    'setFiltro': 'setFiltro',
    'joinVideos': 'joinVideos',
    'createFileRutas': 'createFileRutas',
    'reubicando':'reubicando',
    'test':'test',
    'eliminarArchivos':'eliminarArchivos',
    'verificarDirectorios':'verificarDirectorios',
}

export const listaComandos = {
    'curl': 'curl',
    'youtubedl': 'youtube-dl',
    'dir': 'dir',
    'ffmpeg':'ffmpeg',
    'rm':'rm',
    'ejecucionArchivo':'',
    'default':'',
    'mkdir':'mkdir'
}
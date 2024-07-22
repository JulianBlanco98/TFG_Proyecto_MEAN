export interface User {
    _id: string,
    datos: {
        nombre: string,
        edad: number,
        correo: string,
        password: string,
    },
    moneda: number,
    rol: string
}

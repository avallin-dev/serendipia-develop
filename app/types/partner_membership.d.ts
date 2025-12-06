// import { sociomembresia_pago } from '@prisma/client'

export type PartnerMembershipType = {
    idSocioMembresia: number,
    idEstado: number | null,
    fechaCreacion: string,
    idUsuarioCreo: null,
    idSocio: number,
    idMembresia: number,
    Precio: number,
    fechaInicioMembresia: Date | null,
    estadoMembresia: $Enums.sociomembresia_estadoMembresia | null
    meses: number,
    semanas: number,
    dias: number,
    idTipoMembresia: $Enums.sociomembresia_estadoMembresia | null,
    Vencimiento: number | Date
    ctipomembresia: {
        id: number,
        nombre: string
    },
    membresia: {
        idMembresia: number,
        Nombre: string,
        idEstado: number | null,
        fechaCreacion: Date | null,
        Precio: number,
        idUsuarioCreo: number,
        meses: number,
        horaInicio: Date | null,
        horaFinal: Date | null,
        idTipoMembresia: number,
        semanas: number,
        dias: number
    },
    socio: {
        idSocio: number,
        idEstado: number | null,
        fechaCreacion: Date | null,
        Nombre: string,
        Paterno: string,
        Materno: string,
        DNI: number,
        Telefono: string,
        Observaciones: string,
        idUsuarioCreo: number,
        foto: boolean,
        clave: number,
        huella: boolean | null, /** Duda con este dato */
        fechaNacimiento: Date,
        correo: string,
        idPlan: number,
        blog: boolean | null,
        avanceej: number,
        fechamod: Date | null,
        image_profile: string,
        nivel: string,
        condicionMedica: string,
        grupoId: number | null,
        authorization: number | null,
    }
}
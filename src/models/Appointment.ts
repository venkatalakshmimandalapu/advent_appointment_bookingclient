export interface Appointment {
    appointmentId: number;
    trCompanyId: number;
    terminalId: number;
    driverId: number;
    moveType: string;
    containerNumber: string;
    sizeType: string;
    line: string;
    chassisNo: string;
    appointmentStatus: string;
    appointmentCreated: Date;
    appointmentValidThrough: Date;
    appointmentLastModified: Date;
    gateCode: string;
    isDeleted?: boolean;
    status?: string;
}

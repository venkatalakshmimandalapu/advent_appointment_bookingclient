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
    status?: string; // Use '?' to indicate it can be undefined
    ticketNumber?: string; // New field for ticket number

}

import { Driver } from "./Driver";
import { Terminal } from "./Terminal";
import { TruckingCompany } from "./TruckingCompany";

export class Appointment {
    appointmentId: number;                   // Corresponds to AppointmentId
    trCompanyId: number;                     // Corresponds to TrCompanyId
    terminalId: number;                       // Corresponds to TerminalId
    driverId: number;                         // Corresponds to DriverId
    moveType: string;                         // Corresponds to MoveType
    containerNumber: string;                  // Corresponds to ContainerNumber
    sizeType: string;                         // Corresponds to SizeType
    line: string;                             // Corresponds to Line
    chassisNo?: string;                       // Corresponds to ChassisNo (optional)
    appointmentStatus?: string;               // Corresponds to AppointmentStatus (optional)
    appointmentCreated: Date;                 // Corresponds to AppointmentCreated
    appointmentValidThrough: Date;            // Corresponds to AppointmentValidThrough
    appointmentLastModified: Date;            // Corresponds to AppointmentLastModified
    gateCode?: string;                        // Corresponds to GateCode (optional)

    truckingCompany?: TruckingCompany;        // Corresponds to TruckingCompany (optional)
    terminal?: Terminal;                       // Corresponds to Terminal (optional)
    driver?: Driver;                           // Corresponds to Driver (optional)

    constructor(
        appointmentId: number,
        trCompanyId: number,
        terminalId: number,
        driverId: number,
        moveType: string,
        containerNumber: string,
        sizeType: string,
        line: string,
        appointmentCreated: Date,
        appointmentValidThrough: Date,
        appointmentLastModified: Date,
        chassisNo?: string,
        appointmentStatus?: string,
        gateCode?: string,
        truckingCompany?: TruckingCompany,
        terminal?: Terminal,
        driver?: Driver
    ) {
        this.appointmentId = appointmentId;
        this.trCompanyId = trCompanyId;
        this.terminalId = terminalId;
        this.driverId = driverId;
        this.moveType = moveType;
        this.containerNumber = containerNumber;
        this.sizeType = sizeType;
        this.line = line;
        this.chassisNo = chassisNo;
        this.appointmentStatus = appointmentStatus;
        this.appointmentCreated = appointmentCreated;
        this.appointmentValidThrough = appointmentValidThrough;
        this.appointmentLastModified = appointmentLastModified;
        this.gateCode = gateCode;
        this.truckingCompany = truckingCompany;
        this.terminal = terminal;
        this.driver = driver;
    }
}

import { Appointment } from "./Appointment";
import { TruckingCompany } from "./TruckingCompany";

export class Driver {
    driverId: number;               // Corresponds to DriverId
    trCompanyId: number;            // Corresponds to TrCompanyId
    driverName: string;             // Corresponds to DriverName
    plateNo?: string;               // Corresponds to PlateNo (optional)
    phoneNumber?: string;           // Corresponds to PhoneNumber (optional)
    truckingCompany?: TruckingCompany; // Corresponds to TruckingCompany (optional)
    appointments?: Appointment[];    // Corresponds to Appointments (optional)

    constructor(
        driverId: number,
        trCompanyId: number,
        driverName: string,
        plateNo?: string,
        phoneNumber?: string,
        truckingCompany?: TruckingCompany,
        appointments?: Appointment[]
    ) {
        this.driverId = driverId;
        this.trCompanyId = trCompanyId;
        this.driverName = driverName;
        this.plateNo = plateNo;
        this.phoneNumber = phoneNumber;
        this.truckingCompany = truckingCompany;
        this.appointments = appointments;
    }
}

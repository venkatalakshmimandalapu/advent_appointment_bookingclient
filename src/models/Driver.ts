import { Appointment } from "./Appointment";
import { TruckingCompany } from "./TruckingCompany";

export class Driver {
    static driverId: number;
    driverId(driverId: any) {
      throw new Error('Method not implemented.');
    }
    trCompanyId: number;            // Corresponds to TrCompanyId
    driverName: string;             // Corresponds to DriverName
    plateNo?: string;               // Corresponds to PlateNo (optional)
    phoneNumber?: string;           // Corresponds to PhoneNumber (optional)
    truckingCompany?: TruckingCompany; // Corresponds to TruckingCompany (optional)
    appointments?: Appointment[];    // Corresponds to Appointments (optional)

    constructor(
        trCompanyId: number,
        driverName: string,
        plateNo?: string,
        phoneNumber?: string,
        truckingCompany?: TruckingCompany,
        appointments?: Appointment[]
    ) {
        this.trCompanyId = trCompanyId;
        this.driverName = driverName;
        this.plateNo = plateNo;
        this.phoneNumber = phoneNumber;
        this.truckingCompany = truckingCompany;
        this.appointments = appointments;
    }
}

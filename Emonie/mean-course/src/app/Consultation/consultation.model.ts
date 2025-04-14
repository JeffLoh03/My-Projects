export interface Consultation {
  _id?: string;
  patientName: string;
  doctorName: string;
  date: Date;
  timeSlot: string;
  notes: string;
  consultationType: string;
}

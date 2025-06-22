export type Role =
  | "admin"
  | "manager"
  | "nurse"
  | "teacher"
  | "parent"
  | "student";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone: string;
  address: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender?: string;
  grade?: string;
  class: string;
  parentId: string;
  profileImage?: string;
  healthRecordId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type HealthRecord = {
  id?: string;
  studentId: string;
  height: number;
  weight: number;
  bloodType?: string;
  allergies: string;
  chronicDiseases: string;
  pastMedicalHistory: string;
  visionLeft: string;
  visionRight: string;
  hearingLeft: string;
  hearingRight: string;
  vaccinationHistory: string;
  otherNotes: string;
  lastUpdated?: Date;
};

export interface Allergy {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  symptoms: string;
  treatment: string;
  dateIdentified: Date;
}

export interface ChronicCondition {
  id: string;
  name: string;
  diagnosisDate: Date;
  medications: Medication[];
  notes: string;
}

export interface VisionAssessment {
  id: string;
  date: Date;
  leftEye: number;
  rightEye: number;
  wearsCorrective: boolean;
  notes?: string;
}

export interface HearingAssessment {
  id: string;
  date: Date;
  leftEar: "normal" | "mild loss" | "moderate loss" | "severe loss";
  rightEar: "normal" | "mild loss" | "moderate loss" | "severe loss";
  notes?: string;
}

export interface MedicalHistoryItem {
  id: string;
  date: Date;
  condition: string;
  treatment: string;
  hospital?: string;
  doctor?: string;
  notes?: string;
}

export interface Immunization {
  id: string;
  name: string;
  date: Date;
  dueDate?: Date;
  administered: boolean;
  administeredBy?: string;
  location?: string;
  lotNumber?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  notes?: string;
  requestedByParent: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface MedicalEvent {
  id: string;
  studentId: string;
  date: Date;
  type: "injury" | "illness" | "emergency" | "other";
  description: string;
  symptoms: string[];
  treatment: string;
  medicationsGiven: MedicationGiven[];
  outcome: "resolved" | "referred" | "sent home" | "hospitalized";
  attendedBy: string;
  notifiedParent: boolean;
  notifiedAt?: Date;
  parentResponse?: string;
  notes?: string;
}

export interface MedicationGiven {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: Date;
  administeredBy: string;
}

export interface HealthCheckup {
  id: string;
  type: "routine" | "specialized" | "follow-up";
  schoolYear: string;
  scheduledDate: Date;
  status: "scheduled" | "completed" | "cancelled";
  students: StudentCheckup[];
  conductor: string;
  notes?: string;
}

export interface StudentCheckup {
  id: string;
  studentId: string;
  height: number;
  weight: number;
  bmi: number;
  visionLeft?: number;
  visionRight?: number;
  hearingLeft?: string;
  hearingRight?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  notes?: string;
  recommendations?: string;
  referralNeeded: boolean;
  referralReason?: string;
  parentNotified: boolean;
  parentResponse?: string;
}

export interface VaccinationProgram {
  id: string;
  name: string;
  vaccineType: string;
  targetGrades: string[];
  scheduledDate: Date;
  consentDeadline: Date;
  status: "planned" | "consent_collection" | "in_progress" | "completed";
  students: StudentVaccination[];
  notes?: string;
}

export interface StudentVaccination {
  id: string;
  studentId: string;
  consentGiven: boolean;
  consentGivenAt?: Date;
  consentGivenBy?: string;
  administered: boolean;
  administeredAt?: Date;
  administeredBy?: string;
  lotNumber?: string;
  sideEffects?: string[];
  followUpNeeded: boolean;
  followUpReason?: string;
  notes?: string;
}

export interface MedicalSupply {
  id: string;
  name: string;
  category: "medication" | "first aid" | "equipment" | "other";
  quantity: number;
  unit: string;
  expiryDate?: Date;
  locationStored: string;
  minimumStockLevel: number;
  notes?: string;
  lastUpdated: Date;
}

export interface MedicalSupplyTransaction {
  id: string;
  supplyId: string;
  type: "restock" | "use" | "disposal";
  quantity: number;
  date: Date;
  performedBy: string;
  reason?: string;
  eventId?: string;
  notes?: string;
}

export interface MedicationRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  daysRequired: number;
  startDate: Date;
  endDate: Date;
  status: "requested" | "received" | "completed" | "cancelled";
  notes: string;
  createdAt: Date;
  updatedAt: Date;

  // Các thuộc tính mới cần thêm
  components: string;
  dosesPerDay: number;
  hasReceipt: boolean;
  receivedBy?: string;
  receivedAt?: Date;
}

export interface MedicationLog {
  id: string;
  medicationRequestId: string;
  studentId: string;
  medicationName: string;
  administeredAt: Date;
  administeredBy: string;
  dosage: string;
  studentConditionBefore?: string;
  studentConditionAfter?: string;
  notes?: string;
}

export interface MedicationDiaryEntry {
  id: string;
  studentName: string;
  status: number;
  description: string;
  createAt: string;
  createdBy: string;
}

export interface VaccinationCampaign {
  id: string;
  campaignName: string;
  vaccineType: string;
  description: string;
  startDate: string;
  endDate: string;
  status: number;
  schedules: any[]; // Có thể định nghĩa chi tiết hơn sau
}

export enum VaccinationStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

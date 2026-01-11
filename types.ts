
export enum NavTab {
  DECISION = 'DECISION',
  TARGETS = 'TARGETS',
  CALCULATOR = 'CALCULATOR',
  CHECKLIST = 'CHECKLIST',
  THEORY = 'THEORY',
  AI = 'AI'
}

export enum AlgorithmType {
  CARDIAC_ARREST = 'CARDIAC_ARREST',
  BRADYCARDIA = 'BRADYCARDIA',
  TACHYCARDIA = 'TACHYCARDIA'
}

export interface PatientData {
  weight: number;
  age: number;
  isMultiRescuer: boolean;
}

export interface DrugDose {
  name: string;
  dose: string;
  max?: string;
  note?: string;
  relevantSteps?: string[]; // 关联的决策步骤 ID
  details?: {
    indication: string;
    route: string;
    info: string;
  };
}

export interface Step {
  id: string;
  title: string;
  description: string;
  actions: string[];
  nextSteps?: {
    label: string;
    targetId: string;
    variant?: 'primary' | 'danger' | 'success' | 'warning' | 'info';
  }[];
}

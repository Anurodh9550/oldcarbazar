export type LoanInquiryStatus = "new" | "contacted" | "approved" | "rejected";

export type LoanEmploymentType = "salaried" | "self_employed";

export type LoanInquiry = {
  id: string;
  bankName: string;
  loanPartner: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  monthlyIncome: number;
  employmentType: LoanEmploymentType;
  employmentTypeLabel: string;
  carBudget: string;
  message: string;
  status: LoanInquiryStatus;
  statusLabel: string;
  createdAt: number;
  updatedAt: number;
};

export type CreateLoanInquiryPayload = {
  bank_name: string;
  loan_partner: string;
  full_name: string;
  mobile: string;
  email: string;
  city: string;
  monthly_income: number;
  employment_type: LoanEmploymentType;
  car_budget?: string;
  message?: string;
};

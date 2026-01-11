// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
  role?: string;
}

// Contract types
export interface Contract {
  id: string;
  name: string;
  contract_type: string;
  signing_date: string;
  parties: string[];
  amount?: number;
  risk_level?: 'low' | 'medium' | 'high';
  status: 'pending' | 'active' | 'completed';
  project_id?: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  contract_count: number;
  created_at: string;
}

// Dashboard statistics
export interface DashboardStats {
  total_contracts: number;
  completed_contracts: number;
  pending_contracts: number;
  active_contracts: number;
  recent_contracts: Contract[];
  top_amount_contracts: Contract[];
  high_risk_contracts: Contract[];
}

// Comparison suggestion
export interface ComparisonSuggestion {
  id: string;
  clause_id: string;
  original_text: string;
  suggested_text: string;
  reason: string;
  source_contract_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
}

// Contract clause
export interface ContractClause {
  id: string;
  text: string;
  start_pos: number;
  end_pos: number;
  clause_type?: string;
}
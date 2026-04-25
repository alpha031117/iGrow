export type RawTransaction = {
  id: string
  account_id: string
  category_id: string
  title: string
  amount: number
  direction: 'credit' | 'debit'
}

export const simulationTransactions: RawTransaction[] = [
  { id: "s-001", account_id: "a-001", category_id: "c-001", title: "Nasi Lemak Order", amount: 7, direction: "credit" },
  { id: "s-002", account_id: "a-001", category_id: "c-001", title: "Kuih Set Order", amount: 12, direction: "credit" },
  { id: "s-003", account_id: "a-001", category_id: "c-001", title: "Lunch Order", amount: 9, direction: "credit" },
  { id: "s-004", account_id: "a-001", category_id: "c-001", title: "Dinner Order", amount: 15, direction: "credit" },
  { id: "s-005", account_id: "a-001", category_id: "c-001", title: "Weekend Order", amount: 18, direction: "credit" },
  { id: "s-006", account_id: "a-001", category_id: "c-001", title: "Kuih Raya Order", amount: 8, direction: "credit" },
  { id: "s-007", account_id: "a-001", category_id: "c-001", title: "Breakfast Order", amount: 6, direction: "credit" },
  { id: "s-008", account_id: "a-001", category_id: "c-001", title: "Catering Order", amount: 45, direction: "credit" },
]

export const dummyTransactions: RawTransaction[] = [
  {
    "id": "t-001",
    "account_id": "a-001",
    "category_id": "c-009",
    "title": "Salary Deposit",
    "amount": 5500.00,
    "direction": "credit"
  },
  {
    "id": "t-002",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Teh Tarik & Roti Canai",
    "amount": 8.50,
    "direction": "debit"
  },
  {
    "id": "t-003",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Aiskrim Malaysia",
    "amount": 4.00,
    "direction": "debit"
  },
  {
    "id": "t-004",
    "account_id": "a-001",
    "category_id": "c-002",
    "title": "Petronas Station",
    "amount": 80.00,
    "direction": "debit"
  },
  {
    "id": "t-005",
    "account_id": "a-001",
    "category_id": "c-008",
    "title": "Grab Ride",
    "amount": 18.00,
    "direction": "debit"
  },
  {
    "id": "t-006",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Aiskrim Potong",
    "amount": 6.50,
    "direction": "debit"
  },
  {
    "id": "t-007",
    "account_id": "a-001",
    "category_id": "c-003",
    "title": "Netflix Subscription",
    "amount": 54.90,
    "direction": "debit"
  },
  {
    "id": "t-008",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "McDonald's Lunch",
    "amount": 23.50,
    "direction": "debit"
  },
  {
    "id": "t-009",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Aiskrim Malaysia",
    "amount": 4.00,
    "direction": "debit"
  },
  {
    "id": "t-010",
    "account_id": "a-001",
    "category_id": "c-007",
    "title": "Jaya Grocer",
    "amount": 145.30,
    "direction": "debit"
  },
  {
    "id": "t-011",
    "account_id": "a-001",
    "category_id": "c-001",
    "title": "Freelance Payment",
    "amount": 850.00,
    "direction": "credit"
  },
  {
    "id": "t-012",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Aiskrim Potong",
    "amount": 6.50,
    "direction": "debit"
  },
  {
    "id": "t-013",
    "account_id": "a-001",
    "category_id": "c-005",
    "title": "Spotify Premium",
    "amount": 14.99,
    "direction": "debit"
  },
  {
    "id": "t-014",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Mamak Dinner",
    "amount": 19.00,
    "direction": "debit"
  },
  {
    "id": "t-015",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Aiskrim Malaysia",
    "amount": 4.00,
    "direction": "debit"
  },
  {
    "id": "t-016",
    "account_id": "a-001",
    "category_id": "c-008",
    "title": "Grab Ride",
    "amount": 25.50,
    "direction": "debit"
  },
  {
    "id": "t-017",
    "account_id": "a-001",
    "category_id": "c-010",
    "title": "Gym Membership",
    "amount": 89.00,
    "direction": "debit"
  },
  {
    "id": "t-018",
    "account_id": "a-001",
    "category_id": "c-006",
    "title": "Aiskrim Potong",
    "amount": 6.50,
    "direction": "debit"
  },
  {
    "id": "t-019",
    "account_id": "a-001",
    "category_id": "c-007",
    "title": "Mydin Grocery Run",
    "amount": 67.80,
    "direction": "debit"
  },
  {
    "id": "t-020",
    "account_id": "a-001",
    "category_id": "c-004",
    "title": "iPhone 17 Purchase",
    "amount": 1020.00,
    "direction": "debit"
  }
]

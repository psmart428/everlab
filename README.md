# 🧪 Everlab ORU Diagnostic Parser

This is a fullstack project that allows users to upload `.oru` or `.txt` files (in HL7 ORU format), parse and analyze them, match against diagnostic metrics, and identify potential risk conditions based on lab results.

Built with:

- **Frontend**: Vite + React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express
- **Features**:
  - File upload (.oru, .txt)
  - HL7 ORU multi-patient parsing
  - Comparison with diagnostic thresholds
  - Tailwind UI report with out-of-range metrics
  - CSV-based dynamic thresholds and condition mapping

---

## 📁 Project Structure

```
everlab/
├── backend/                  # Node.js + Express server
│   ├── utils/                # CSV/ORU parsers
│   ├── csv/                  # Static CSV files (diagnostic data)
│   └── index.js              # Main Express app
│
├── frontend/                 # Vite + React + Tailwind app
│   ├── src/
│   │   ├── components/       # React UI components
│   │   ├── types/            # Shared interfaces (TS)
│   │   ├── utils.ts          # Frontend helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
```

---

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/yourusername/everlab.git
cd everlab
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### ➕ CSV Files

Place your `.csv` files under:

```
backend/csv/
├── diagnostic_metrics.csv
├── diagnostic_conditions.csv
```

### ▶️ Start the server

```bash
npm start
```

Server runs at: `http://localhost:3001`

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

### ✅ TailwindCSS Setup (already configured)

Follow this link: `https://tailwindcss.com/docs/installation/using-vite`

### ▶️ Run the frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📤 Upload Workflow

1. Upload `.oru` or `.txt` file
2. File is sent to `POST /api/upload-oru`
3. Backend parses all ORU segments per patient
4. Each `Observation` is enriched with diagnostic metric ranges
5. Patients with **out-of-range metrics** and **matched conditions** are shown in a table

---

## 📐 Matching Logic

- Matches are made by:
  - `oru_sonic_codes`
  - `oru_sonic_units`
- Supports:
  - Gender- and age-specific ranges
  - Fallback for missing lower bounds (assumes 0 if only upper exists)
- Automatically includes metrics with no thresholds (for visibility)

---

## 📊 UI Report (Tailwind)

The `RiskReport` component:

- Groups flagged metrics by patient
- Shows matched conditions
- Displays everlab and standard range data
- Mobile-friendly with scrollable tables

---

## 📁 TypeScript Interfaces

Shared via `frontend/src/types/interfaces.ts`, including:

- `Patient`, `Observation`
- `DiagnosticMetric`, `DiagnosticCondition`
- `EnrichedObservation`, `FlaggedPatient`

Used across parsing, UI, and utility functions.

---

## ✅ Extensions (Future Ideas)

- Add PDF/CSV export for reports
- Admin dashboard to upload new CSV definitions
- Auto-flagging severity (mild/moderate/severe) based on thresholds
- OAuth login for secure usage

---

## 🧑‍💻 Author

Built with ❤️ by Alex Karpov  
Feel free to fork, contribute, or ask questions.

---

## 📄 License

MIT License
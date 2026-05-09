import { useState } from "react"

import {
  LayoutDashboard,
  Upload,
  ShieldCheck,
  LogOut,
  Loader2
} from "lucide-react"

function Dashboard() {

  const [file, setFile] = useState(null)

  const [activeSection, setActiveSection] = useState("dashboard")

  const [loadingOCR, setLoadingOCR] = useState(false)
  const [loadingEligibility, setLoadingEligibility] = useState(false)

  const [patientName, setPatientName] = useState("")
  const [insuranceCompany, setInsuranceCompany] = useState("")
  const [hospitalName, setHospitalName] = useState("")
  const [injuryDate, setInjuryDate] = useState("")
  const [policyEffectiveDate, setPolicyEffectiveDate] = useState("")
  const [injuryDescription, setInjuryDescription] = useState("")

  const [decision, setDecision] = useState("")
  const [message, setMessage] = useState("")


  const formatDate = (date) => {

    if (!date) return ""

    const [year, month, day] = date.split("-")

    return `${month}/${day}/${year}`
  }


  const handleUpload = async () => {

    if (!file) {
      alert("Please upload insurance card")
      return
    }

    const formData = new FormData()

    formData.append("file", file)

    try {

      setLoadingOCR(true)

      const response = await fetch(
        "http://127.0.0.1:8000/ocr/upload",
        {
          method: "POST",
          body: formData
        }
      )

      const data = await response.json()

      setPatientName(data.patient_name || "")
      setInsuranceCompany(data.insurance_company || "")
      setHospitalName(data.hospital_name || "")

    } catch (error) {

      console.error(error)

    } finally {

      setLoadingOCR(false)

    }

  }


  const handleCheck = async () => {

    try {

      setLoadingEligibility(true)

      const response = await fetch(
        "http://127.0.0.1:8000/eligibility/check",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            patient_name: patientName,
            insurance_company: insuranceCompany,
            hospital_name: hospitalName,
            injury_date: formatDate(injuryDate),
            policy_effective_date: formatDate(policyEffectiveDate),
            injury_description: injuryDescription
          })
        }
      )

      const data = await response.json()

      setDecision(data.status)
      setMessage(data.message)

    } catch (error) {

      console.error(error)

    } finally {

      setLoadingEligibility(false)

    }

  }


  return (

    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}

      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">

        <div>

          <div>

            <h1 className="text-3xl font-bold text-blue-400">
              ClaimSense AI
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Insurance Eligibility System
            </p>

          </div>


          <div className="mt-10 space-y-4">

            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all ${
                activeSection === "dashboard"
                  ? "bg-blue-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>


            <button
              onClick={() => setActiveSection("ocr")}
              className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all ${
                activeSection === "ocr"
                  ? "bg-blue-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <Upload size={20} />
              OCR Upload
            </button>


            <button
              onClick={() => setActiveSection("eligibility")}
              className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all ${
                activeSection === "eligibility"
                  ? "bg-blue-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <ShieldCheck size={20} />
              Eligibility
            </button>

          </div>

        </div>


        {/* Logout */}

        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.reload()
          }}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 transition-all p-3 rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>


      {/* Main Content */}

      <div className="flex-1 p-8 overflow-auto">

        {/* Dashboard Section */}

        {activeSection === "dashboard" && (

          <>

            <h1 className="text-4xl font-bold mb-8">
              Dashboard Overview
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">

                <h3 className="text-slate-400">
                  Total Claims
                </h3>

                <p className="text-4xl font-bold mt-3">
                  124
                </p>

              </div>


              <div className="bg-emerald-900/20 p-6 rounded-3xl border border-emerald-700">

                <h3 className="text-emerald-300">
                  Approved
                </h3>

                <p className="text-4xl font-bold mt-3">
                  98
                </p>

              </div>


              <div className="bg-red-900/20 p-6 rounded-3xl border border-red-700">

                <h3 className="text-red-300">
                  Denied
                </h3>

                <p className="text-4xl font-bold mt-3">
                  26
                </p>

              </div>

            </div>


            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">

              <h2 className="text-2xl font-bold mb-4">
                AI Insurance Eligibility Platform
              </h2>

              <p className="text-slate-400 leading-8">
                ClaimSense AI helps hospitals and insurance providers automate OCR extraction,
                policy verification, and insurance eligibility analysis using AI-powered workflows.
              </p>

            </div>

          </>

        )}


        {/* OCR SECTION */}

        {activeSection === "ocr" && (

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 max-w-3xl">

            <h1 className="text-3xl font-bold mb-8">
              OCR Upload Center
            </h1>


            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center bg-slate-800/40">

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full"
              />

              <p className="text-slate-400 mt-4">
                Upload insurance card PDF or image
              </p>

            </div>


            <button
              onClick={handleUpload}
              disabled={loadingOCR}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 transition-all p-4 rounded-xl font-semibold flex items-center justify-center gap-3"
            >

              {loadingOCR && (
                <Loader2 className="animate-spin" size={20} />
              )}

              {loadingOCR
                ? "Analyzing Insurance Card..."
                : "Upload & Extract Insurance Data"}

            </button>


            {patientName && (

              <div className="mt-10 bg-slate-800 p-6 rounded-2xl border border-slate-700">

                <h2 className="text-2xl font-bold mb-6">
                  OCR Extracted Information
                </h2>


                <div className="space-y-6">

                  <div>
                    <p className="text-slate-400 text-sm">
                      Patient Name
                    </p>

                    <p className="text-lg">
                      {patientName}
                    </p>
                  </div>


                  <div>
                    <p className="text-slate-400 text-sm">
                      Insurance Company
                    </p>

                    <p className="text-lg">
                      {insuranceCompany}
                    </p>
                  </div>


                  <div>
                    <p className="text-slate-400 text-sm">
                      Hospital Name
                    </p>

                    <p className="text-lg">
                      {hospitalName}
                    </p>
                  </div>

                </div>

              </div>

            )}

          </div>

        )}


        {/* ELIGIBILITY SECTION */}

        {activeSection === "eligibility" && (

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 max-w-4xl">

            <h1 className="text-3xl font-bold mb-8">
              Eligibility Check
            </h1>


            <div className="space-y-5">

              <input
                placeholder="Patient Name"
                value={patientName}
                onChange={(e)=>setPatientName(e.target.value)}
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
              />


              <input
                placeholder="Insurance Company"
                value={insuranceCompany}
                onChange={(e)=>setInsuranceCompany(e.target.value)}
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
              />


              <input
                placeholder="Hospital Name"
                value={hospitalName}
                onChange={(e)=>setHospitalName(e.target.value)}
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
              />


              <div>

                <label className="text-slate-400 text-sm">
                  Injury Date
                </label>

                <input
                  type="date"
                  value={injuryDate}
                  onChange={(e)=>setInjuryDate(e.target.value)}
                  className="w-full mt-2 bg-slate-800 p-4 rounded-xl border border-slate-700"
                />

              </div>


              <div>

                <label className="text-slate-400 text-sm">
                  Policy Effective Date
                </label>

                <input
                  type="date"
                  value={policyEffectiveDate}
                  onChange={(e)=>setPolicyEffectiveDate(e.target.value)}
                  className="w-full mt-2 bg-slate-800 p-4 rounded-xl border border-slate-700"
                />

              </div>


              <textarea
                placeholder="Injury Description"
                value={injuryDescription}
                onChange={(e)=>setInjuryDescription(e.target.value)}
                className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 h-32"
              />


              <button
                onClick={handleCheck}
                disabled={loadingEligibility}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 transition-all p-4 rounded-xl font-semibold flex items-center justify-center gap-3"
              >

                {loadingEligibility && (
                  <Loader2 className="animate-spin" size={20} />
                )}

                {loadingEligibility
                  ? "Running AI Eligibility Analysis..."
                  : "Check Eligibility"}

              </button>

            </div>


            {decision && (

              <div className={`mt-10 rounded-3xl p-8 border ${
                decision === "approved"
                  ? "bg-emerald-900/20 border-emerald-700"
                  : "bg-red-900/20 border-red-700"
              }`}>

                <h2 className="text-2xl font-bold mb-4">
                  Eligibility Result
                </h2>

                <p className="text-xl">
                  <span className="font-bold">
                    Status:
                  </span>{" "}
                  {decision}
                </p>

                <p className="mt-4 text-slate-300 text-lg">
                  {message}
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  )

}

export default Dashboard
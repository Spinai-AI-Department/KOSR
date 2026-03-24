import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const devices = ["Joimax", "RIWOspine", "Stryker", "Endovision"];

const approachOptions = ["Full-endo", "UBE", "Open"] as const;
type Approach = (typeof approachOptions)[number];

export function SurgeryDataEntry() {
  const [selectedApproach, setSelectedApproach] = useState<Approach>("UBE");
  const [selectedTechnique, setSelectedTechnique] = useState("interlaminar");
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [implants, setImplants] = useState({ cage: false, screws: false, none: false });
  const [conversionYes, setConversionYes] = useState(true);
  const [conversionNo, setConversionNo] = useState(false);

  // Patient & Surgery info
  const [patientId, setPatientId] = useState("");
  const [surgeryDate, setSurgeryDate] = useState("");
  const [surgeon, setSurgeon] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [opLevel, setOpLevel] = useState("");
  const [opTime, setOpTime] = useState("");
  const [bloodLoss, setBloodLoss] = useState("");
  const [hospitalDays, setHospitalDays] = useState("");

  const toggleImplant = (key: keyof typeof implants) => {
    if (key === "none") {
      setImplants({ cage: false, screws: false, none: !implants.none });
    } else {
      setImplants((prev) => ({ ...prev, none: false, [key]: !prev[key] }));
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900">KSOR 수술 정보 입력</h1>
        <p className="text-gray-500 mt-1">Korean Spine Outcomes Registry — Surgery Data Entry</p>
      </div>

      {/* Section 1: 환자 및 수술 기본 정보 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-5">
        <h2 className="text-base text-gray-900 mb-5">환자 및 수술 기본 정보</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Patient ID</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="예: 201933070"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">수술일 (Surgery Date)</label>
            <input
              type="date"
              value={surgeryDate}
              onChange={(e) => setSurgeryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">집도의 (Surgeon)</label>
            <input
              type="text"
              value={surgeon}
              onChange={(e) => setSurgeon(e.target.value)}
              placeholder="집도의 이름"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">진단명 (Diagnosis)</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="예: 요추 추간판 탈출증"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">수술 레벨 (Op Level)</label>
            <input
              type="text"
              value={opLevel}
              onChange={(e) => setOpLevel(e.target.value)}
              placeholder="예: L4-L5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">수술 시간 (Op Time, min)</label>
            <input
              type="number"
              value={opTime}
              onChange={(e) => setOpTime(e.target.value)}
              placeholder="분 단위"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">출혈량 (Blood Loss, mL)</label>
            <input
              type="number"
              value={bloodLoss}
              onChange={(e) => setBloodLoss(e.target.value)}
              placeholder="mL 단위"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">입원 기간 (Hospital Days)</label>
            <input
              type="number"
              value={hospitalDays}
              onChange={(e) => setHospitalDays(e.target.value)}
              placeholder="일 수"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: 수술 접근법 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-5">
        <h2 className="text-base text-gray-900 mb-4">수술 접근법</h2>
        <div className="flex gap-3">
          {approachOptions.map((approach) => (
            <button
              key={approach}
              onClick={() => setSelectedApproach(approach)}
              className={`px-8 py-2 rounded-full border text-sm transition-colors ${
                selectedApproach === approach
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {approach}
            </button>
          ))}
        </div>
      </div>

      {/* Section 3+4: 내시경 세부술기 + 사용 내시경 장비 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* 내시경 세부 술기 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base text-gray-900 mb-4">내시경 세부 술기</h2>
          <div className="space-y-3">
            {[
              { value: "interlaminar", label: "추궁간 (Interlaminar)" },
              { value: "transforaminal", label: "추간공 (Transforaminal)" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedTechnique === opt.value
                      ? "border-blue-600 bg-white"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedTechnique(opt.value)}
                >
                  {selectedTechnique === opt.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  )}
                </div>
                <span className="text-sm text-gray-700" onClick={() => setSelectedTechnique(opt.value)}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 사용 내시경 장비 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base text-gray-900 mb-4">사용 내시경 장비</h2>
          <div className="relative">
            <button
              onClick={() => setDeviceOpen(!deviceOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedDevice ? "text-gray-900" : "text-gray-400"}>
                {selectedDevice || "장비 선택"}
              </span>
              {deviceOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {deviceOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {devices.map((device) => (
                  <button
                    key={device}
                    onClick={() => { setSelectedDevice(device); setDeviceOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                      selectedDevice === device ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {device}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 5+6: 임플란트 사용 + 개방술 전환 여부 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* 임플란트 사용 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base text-gray-900 mb-4">임플란트 사용</h2>
          <div className="space-y-3">
            {(["cage", "screws", "none"] as const).map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    implants[key] ? "border-blue-600 bg-blue-600" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => toggleImplant(key)}
                >
                  {implants[key] && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700" onClick={() => toggleImplant(key)}>
                  {key === "cage" ? "Cage" : key === "screws" ? "Screws" : "없음"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 개방술 전환 여부 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base text-gray-900 mb-4">개방술 전환 여부</h2>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setConversionYes(true); setConversionNo(false); }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  conversionYes ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    conversionYes ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700">예</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setConversionNo(true); setConversionYes(false); }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  conversionNo ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    conversionNo ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700">아니오</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: 수술 전 PROMs (Patient-Reported Outcome Measures) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-5">
        <h2 className="text-base text-gray-900 mb-5">수술 전 PROMs <span className="text-sm text-gray-400 ml-1">(Pre-operative Patient-Reported Outcome Measures)</span></h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "허리 통증 VAS", sublabel: "Back Pain VAS (0–10)", key: "back_vas" },
            { label: "다리 통증 VAS", sublabel: "Leg Pain VAS (0–10)", key: "leg_vas" },
            { label: "ODI 점수", sublabel: "Oswestry Disability Index (%)", key: "odi" },
            { label: "EQ-5D", sublabel: "EuroQoL 5-Dimension", key: "eq5d" },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-sm text-gray-700 mb-0.5">{item.label}</label>
              <span className="block text-xs text-gray-400 mb-1.5">{item.sublabel}</span>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          임시 저장
        </button>
        <button className="px-8 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
          저장
        </button>
      </div>
    </div>
  );
}

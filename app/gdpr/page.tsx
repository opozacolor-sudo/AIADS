import Link from "next/link";

export default function GDPRPage() {
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto" style={{ backgroundColor: "#FFF9FA" }}>
      <Link href="/chat" className="text-sm" style={{ color: "#FD1843" }}>&larr; Înapoi</Link>
      <h1 className="text-3xl font-bold mb-6 mt-4" style={{ color: "#FD1843" }}>GDPR</h1>
      <div className="space-y-4 text-gray-700" style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "1.5rem" }}>
        <p>
          Operator de date: <strong>[Nume firmă]</strong>, CUI <strong>[CUI]</strong>, cu sediul social în <strong>[Sediu social]</strong>.
        </p>
        <p>Conform Regulamentului (UE) 2016/679 (GDPR), AIADS prelucrează datele personale în mod legal, echitabil și transparent.</p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Drepturile tale</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Dreptul de acces la date</li>
          <li>Dreptul la rectificare</li>
          <li>Dreptul la ștergere ("dreptul de a fi uitat")</li>
          <li>Dreptul la restricționarea prelucrării</li>
          <li>Dreptul la portabilitatea datelor</li>
          <li>Dreptul de opoziție la prelucrare</li>
          <li>Dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Date prelucrate</h2>
        <p>
          Pentru a livra campanii publicitare, prelucrăm datele de identificare ale contului, datele de facturare și
          token-urile de acces OAuth către platformele de advertising conectate (Meta, TikTok, Google, LinkedIn).
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Contact DPO</h2>
        <p>Email: <strong>[email DPO]</strong></p>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto" style={{ backgroundColor: "#FFF9FA" }}>
      <Link href="/chat" className="text-sm" style={{ color: "#FD1843" }}>&larr; Înapoi</Link>
      <h1 className="text-3xl font-bold mb-6 mt-4" style={{ color: "#FD1843" }}>Politica de Confidențialitate</h1>
      <div className="space-y-4 text-gray-700" style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "1.5rem" }}>
        <p>
          <strong>[Nume firmă]</strong> (&quot;AIADS&quot;) respectă confidențialitatea datelor tale personale și se angajează
          să le protejeze conform legislației în vigoare.
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Ce date colectăm</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Date de identificare (nume, email)</li>
          <li>Date de facturare (denumire companie, CUI, adresă)</li>
          <li>Date de utilizare a platformei (istoricul campaniilor, mesajele din Chat AI)</li>
          <li>Token-uri de acces OAuth pentru conturile sociale conectate (Meta, TikTok, Google, LinkedIn)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Cum folosim datele</h2>
        <p>
          Datele sunt folosite exclusiv pentru a configura și lansa campaniile publicitare solicitate de tine, pentru
          facturare și pentru a îmbunătăți funcționarea platformei. Nu vindem datele tale către terți.
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Partajarea datelor</h2>
        <p>
          Datele necesare lansării campaniilor sunt transmise către platformele de advertising alese de tine (Meta,
          TikTok, Google, LinkedIn), conform termenilor și condițiilor proprii ale acestor platforme.
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Mai multe detalii</h2>
        <p>
          Pentru detalii despre drepturile tale GDPR, vezi <Link href="/gdpr" className="underline" style={{ color: "#FD1843" }}>pagina GDPR</Link>.
        </p>
      </div>
    </div>
  );
}

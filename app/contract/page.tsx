import Link from "next/link";

export default function ContractPage() {
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto" style={{ backgroundColor: "#FFF9FA" }}>
      <Link href="/chat" className="text-sm" style={{ color: "#FD1843" }}>&larr; Înapoi</Link>
      <h1 className="text-3xl font-bold mb-6 mt-4" style={{ color: "#FD1843" }}>Contract de Prestări Servicii</h1>
      <div className="space-y-4 text-gray-700" style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "1.5rem" }}>
        <p>
          Contract de prestări servicii încheiat între <strong>[Nume firmă]</strong>, CUI <strong>[CUI]</strong>, cu
          sediul social în <strong>[Sediu social]</strong> (&quot;Prestator&quot;) și utilizatorul platformei AIADS (&quot;Client&quot;).
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Obiectul contractului</h2>
        <p>
          Prestatorul furnizează servicii de creare, configurare și lansare automată a campaniilor publicitare online
          pe platformele Meta, TikTok, Google și LinkedIn, prin intermediul unui asistent AI conversațional.
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Mecanism de plată</h2>
        <p>
          Clientul alimentează contul AIADS cu suma dorită + TVA. Prestatorul reține un comision de <strong>10%</strong> din
          suma alimentată; restul de 90% devine credit informativ, folosit pentru a configura campanii. Plata efectivă
          către platformele de advertising (Meta, TikTok, Google, LinkedIn) se efectuează de către Prestator, din
          conturile sale de business conectate la aceste platforme.
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Durata</h2>
        <p>
          Contractul este valabil pe perioada utilizării platformei și poate fi reziliat de oricare dintre părți, cu
          o notificare prealabilă de 30 de zile.
        </p>

        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Răspundere</h2>
        <p>
          Prestatorul nu garantează rezultate specifice ale campaniilor publicitare (vizualizări, conversii, vânzări),
          acestea depinzând de factori externi controlați de platformele de advertising terțe.
        </p>
      </div>
    </div>
  );
}

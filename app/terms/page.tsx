export default function TermsPage() {
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto" style={{ backgroundColor: "#FFF9FA" }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#FD1843" }}>Termeni si Conditii</h1>
      <div className="space-y-4 text-gray-700" style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "1.5rem" }}>
        <p>Prin utilizarea platformei AIADS, accepti urmatorii termeni si conditii.</p>
        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Serviciile noastre</h2>
        <p>AIADS ofera o platforma de gestionare automata a campaniilor publicitare pe retelele sociale.</p>
        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Comisioane</h2>
        <p>Platforma percepe un comision progresiv in functie de bugetul campaniilor publicitare.</p>
        <h2 className="text-xl font-semibold mt-4" style={{ color: "#FD1843" }}>Limitarea raspunderii</h2>
        <p>AIADS nu este responsabil pentru continutul reclamelor create de utilizatori.</p>
      </div>
    </div>
  );
}
import { useState } from "react";
import Landing from "./Landing";
import Demo from "./Demo";

export default function App() {
  const [page, setPage] = useState("home");
  if (page === "demo") return <Demo onBack={() => setPage("home")} />;
  return <Landing onDemo={() => setPage("demo")} />;
}

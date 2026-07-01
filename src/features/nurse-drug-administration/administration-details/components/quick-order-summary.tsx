import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ReadOnly, Section } from "../ui";

export function QuickOrderSummary({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return <Section title="Quick Order Summary"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{rows.map(([label, value]) => <ReadOnly key={label} label={label} value={value} />)}</div></Section>;
}

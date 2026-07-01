import { Badge } from "@/components/ui/badge";

import { ReadOnly, Section } from "../ui";
import { statusTone } from "../utils";

export function FiveRightsCheck(props: {
  rightPatientStatus: string;
  rightDrugStatus: string;
  rightDoseStatus: string;
  rightRouteStatus: string;
  rightTimeStatus: string;
  canShowVerification: boolean;
  nurseVerified: boolean;
  setNurseVerified: (value: boolean) => void;
  verifiedOn: string;
  setVerifiedOn: (value: string) => void;
  nowString: string;
}) {
  const { rightPatientStatus, rightDrugStatus, rightDoseStatus, rightRouteStatus, rightTimeStatus, canShowVerification, nurseVerified, setNurseVerified, verifiedOn, setVerifiedOn, nowString } = props;
  return <Section title="5 Rights Check">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* <div className="rounded-md border border-border bg-surface p-3 space-y-2">
        <div className="text-sm font-semibold">Right Patient</div>
        <Badge tone={statusTone(rightPatientStatus) as any}>{rightPatientStatus}</Badge>
        </div> */}
        <div className="rounded-md border border-border bg-surface p-3 space-y-2">
          <div className="text-sm font-semibold">Right Drug</div><Badge tone={statusTone(rightDrugStatus) as any}>{rightDrugStatus}</Badge>{rightDrugStatus !== "Verified" ? <><div className="text-xs text-muted-foreground">Drug reconciliation needs attention.</div></> : null}</div><div className="rounded-md border border-border bg-surface p-3 space-y-2"><div className="text-sm font-semibold">Right Dose</div><Badge tone={statusTone(rightDoseStatus) as any}>{rightDoseStatus}</Badge></div><div className="rounded-md border border-border bg-surface p-3 space-y-2"><div className="text-sm font-semibold">Right Route</div><Badge tone={statusTone(rightRouteStatus) as any}>{rightRouteStatus}</Badge></div><div className="rounded-md border border-border bg-surface p-3 space-y-2"><div className="text-sm font-semibold">Right Time</div><Badge tone={statusTone(rightTimeStatus) as any}>{rightTimeStatus}</Badge></div></div>{canShowVerification ? <div className="space-y-3 rounded-md border border-border bg-surface p-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={nurseVerified} onChange={(event) => { setNurseVerified(event.target.checked); if (event.target.checked) setVerifiedOn(nowString); }} /><span>I confirm that all medication rights have been verified.</span></label>{nurseVerified ? <div className="grid gap-3 sm:grid-cols-2"><ReadOnly label="Verified By" value="Logged-in Nurse" /><ReadOnly label="Verified On" value={verifiedOn || nowString} /></div> : null}</div> : null}</Section>;
}

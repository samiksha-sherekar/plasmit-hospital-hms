import { Button } from "@/components/ui/button";

export function DrawerFooter(props: {
  actionType: "administer" | "manage" | "review" | "continue" | null;
  onCancel: () => void;
  onSaveDraft: () => void;
  onConfirmAdminister: () => void;
  onCompleteContinueAdministration: () => void;
  administerReady: boolean;
  continueReady: boolean;
}) {
  const { actionType, onCancel, onSaveDraft, onConfirmAdminister, onCompleteContinueAdministration, administerReady, continueReady } = props;
  return actionType === "administer" ? (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      {/* <Button variant="outline" onClick={onSaveDraft}>Save Draft</Button> */}
      <Button onClick={onConfirmAdminister} disabled={!administerReady}>Confirm & Administer</Button>
    </div>
  ) : actionType === "continue" ? (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      {/* <Button variant="outline" onClick={onSaveDraft}>Save Draft</Button> */}
      <Button onClick={onCompleteContinueAdministration} disabled={!continueReady}>Complete Administration</Button>
    </div>
  ) : (
    <div className="flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={onSaveDraft}>Save</Button></div>
  );
}

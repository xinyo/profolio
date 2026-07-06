import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

type SalesOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SalesOrderDialog({ open, onOpenChange }: SalesOrderDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("factory.views.salesOrders.createOrder")}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("factory.views.salesOrders.cancel")}
          </Button>
          <Button type="submit">
            {t("factory.views.salesOrders.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

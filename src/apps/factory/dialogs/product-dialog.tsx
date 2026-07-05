import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDialog({ open, onOpenChange }: ProductDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("factory.views.productCategories.addProduct")}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("factory.views.productCategories.cancel")}
          </Button>
          <Button type="submit">
            {t("factory.views.productCategories.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
